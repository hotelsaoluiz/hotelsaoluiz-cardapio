import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ImageUpload } from './ImageUpload'

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  description: z.string().optional().or(z.literal('')),
  price: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined
    const parsed = Number(val)
    return isNaN(parsed) ? undefined : parsed
  }, z.number({
    invalid_type_error: 'Informe um preço',
  }).positive('Preço inválido')),
  category_id: z.string().uuid().optional().nullable().or(z.literal('')),
  subcategory: z.string().optional().or(z.literal('')),
  available: z.boolean().default(true),
})

export function ProductForm({
  initialData = null,
  categories = [],
  products = [],
  onSubmit,
  onCancel,
  isSaving = false,
}) {
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || '',
      category_id: initialData?.category_id || '',
      subcategory: initialData?.subcategory || '',
      available: initialData?.available !== undefined ? initialData.available : true,
    },
  })

  const selectedCategoryId = watch('category_id')

  const existingSubcategories = React.useMemo(() => {
    if (!selectedCategoryId) return []
    const catProducts = products.filter((p) => p.category_id === selectedCategoryId)
    return Array.from(new Set(catProducts.map((p) => p.subcategory).filter(Boolean))).sort()
  }, [selectedCategoryId, products])

  // Synchronize dynamic updates to initial data
  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name)
      setValue('description', initialData.description || '')
      setValue('price', initialData.price)
      setValue('category_id', initialData.category_id || '')
      setValue('subcategory', initialData.subcategory || '')
      setValue('available', initialData.available)
      setImageUrl(initialData.image_url || '')
    }
  }, [initialData, setValue])

  const handleFormSubmit = (data) => {
    // Normalise category_id to null if empty string
    const normalizedData = {
      ...data,
      category_id: data.category_id === '' ? null : data.category_id,
      image_url: imageUrl || null,
    }
    onSubmit(normalizedData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Name Input */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-1">
          Nome do Produto *
        </label>
        <input
          type="text"
          {...register('name')}
          disabled={isSaving}
          className="w-full px-3 py-2 border border-slate-300 rounded-admin focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy text-sm transition-all"
          placeholder="Ex: Filé Mignon ao Molho Madeira"
        />
        {errors.name && (
          <p className="text-red-600 text-xs mt-1 font-medium">{errors.name.message}</p>
        )}
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-1">
          Descrição (Ingredientes / Detalhes)
        </label>
        <textarea
          {...register('description')}
          disabled={isSaving}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-admin focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy text-sm transition-all resize-none"
          placeholder="Ex: Acompanha arroz branco, batata frita crocante e farofa de ovos caseira."
        />
        {errors.description && (
          <p className="text-red-600 text-xs mt-1 font-medium">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Price Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-1">
            Preço (R$) *
          </label>
          <input
            type="number"
            step="0.01"
            {...register('price')}
            disabled={isSaving}
            className="w-full px-3 py-2 border border-slate-300 rounded-admin focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy text-sm transition-all"
            placeholder="Ex: 89.90"
          />
          {errors.price && (
            <p className="text-red-650 text-xs mt-1 font-medium">{errors.price.message}</p>
          )}
        </div>

        {/* Category Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-1">
            Categoria
          </label>
          <select
            {...register('category_id')}
            disabled={isSaving}
            className="w-full px-3 py-2 border border-slate-300 rounded-admin bg-white focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy text-sm transition-all"
          >
            <option value="">Sem categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-red-650 text-xs mt-1 font-medium">{errors.category_id.message}</p>
          )}
        </div>

        {/* Subcategory Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-1">
            Subcategoria
          </label>
          <input
            type="text"
            list="existing-subcategories-list"
            {...register('subcategory')}
            disabled={isSaving}
            className="w-full px-3 py-2 border border-slate-300 rounded-admin focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy text-sm transition-all"
            placeholder="Ex: Vinhos, Pizzas"
            autoComplete="off"
          />
          <datalist id="existing-subcategories-list">
            {existingSubcategories.map((sub) => (
              <option key={sub} value={sub} />
            ))}
          </datalist>
          {errors.subcategory && (
            <p className="text-red-650 text-xs mt-1 font-medium">{errors.subcategory.message}</p>
          )}
        </div>
      </div>

      {/* Image Upload Area */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-1">
          Imagem do Prato
        </label>
        <ImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          disabled={isSaving}
        />
      </div>

      {/* Availability Switch */}
      <div className="flex items-center gap-3 py-2">
        <input
          type="checkbox"
          id="available"
          {...register('available')}
          disabled={isSaving}
          className="w-4 h-4 text-navy border-slate-300 rounded focus:ring-navy cursor-pointer"
        />
        <label htmlFor="available" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
          Disponível para os clientes (Visível no cardápio)
        </label>
      </div>

      {/* Actions buttons */}
      <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="px-4 py-2 border border-slate-300 rounded-admin text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2 bg-navy hover:bg-navy-mid text-white rounded-admin text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
        >
          {isSaving ? 'Salvando...' : initialData ? 'Salvar Alterações' : 'Adicionar Produto'}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
