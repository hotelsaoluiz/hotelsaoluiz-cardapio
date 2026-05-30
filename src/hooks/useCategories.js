import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

// Fetch all categories
const fetchAllCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export function useCategories() {
  const queryClient = useQueryClient()

  // Query to get all categories
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchAllCategories,
  })

  // Mutation to create a category
  const createMutation = useMutation({
    mutationFn: async (newCategory) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([newCategory])
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  // Mutation to update a category
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      // Products might reference categories, invalidating both keeps it robust
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  // Mutation to delete a category
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw new Error(error.message)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      // Invalidate products too because deleting category sets category_id to null
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  return {
    categories,
    isLoading,
    error,
    createCategory: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCategory: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteCategory: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  }
}
