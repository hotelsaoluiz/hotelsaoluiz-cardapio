import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useAuth } from '../hooks/useAuth'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { QRCodeDisplay } from '../components/shared/QRCodeDisplay'
import { ProductForm } from '../components/admin/ProductForm'
import { ConfirmDialog } from '../components/admin/ConfirmDialog'
import HotelLogo from '../components/menu/HotelLogo'
import { 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Grid, 
  Utensils, 
  QrCode, 
  Eye, 
  EyeOff, 
  Loader2,
  ListOrdered,
  Users,
  Database,
  HardDrive
} from 'lucide-react'

// Helper to generate slug from name
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

export function Admin() {
  const { signOut } = useAuth()
  const { products, createProduct, updateProduct, deleteProduct, isLoading: isLoadingProducts } = useProducts()
  const { categories, createCategory, updateCategory, deleteCategory, isLoading: isLoadingCategories } = useCategories()

  const [activeTab, setActiveTab] = useState('products') // 'products' | 'categories' | 'qrcode'
  
  // Modals & States for Product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [isProductSaving, setIsProductSaving] = useState(false)
  const [isProductDeleting, setIsProductDeleting] = useState(false)

  // States for Categories (Inline Editing & Quick Create)
  const [newCatName, setNewCatName] = useState('')
  const [newCatOrder, setNewCatOrder] = useState('0')
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [editingCatName, setEditingCatName] = useState('')
  const [editingCatOrder, setEditingCatOrder] = useState('0')
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState(null)
  const [isCategoryDeleting, setIsCategoryDeleting] = useState(false)

  // States for User Creation / New Admin Management
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [newUserConfirmPassword, setNewUserConfirmPassword] = useState('')
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [userCreationMessage, setUserCreationMessage] = useState(null)
  const [userCreationError, setUserCreationError] = useState(null)

  // Database & Storage Size Stats States
  const [storageFiles, setStorageFiles] = useState([])
  const [totalStorageSize, setTotalStorageSize] = useState(0)
  const [orphanedFiles, setOrphanedFiles] = useState([])
  const [isStorageLoading, setIsStorageLoading] = useState(false)
  const [isCleaningStorage, setIsCleaningStorage] = useState(false)
  const [dbSizeExact, setDbSizeExact] = useState(null)
  const [showSqlInstructions, setShowSqlInstructions] = useState(false)

  const fetchStorageStats = async () => {
    setIsStorageLoading(true)
    try {
      // 1. Try to get exact DB size via RPC if it exists
      try {
        const { data, error } = await supabase.rpc('get_db_size')
        if (!error && data) {
          setDbSizeExact(data.database_size_bytes || null)
        } else {
          setDbSizeExact(null)
        }
      } catch (err) {
        setDbSizeExact(null)
      }

      // 2. Fetch storage files in 'products' directory
      const { data: files, error: storageError } = await supabase.storage
        .from('product-images')
        .list('products', { limit: 1000 })

      if (storageError) throw storageError

      if (files) {
        setStorageFiles(files)
        const total = files.reduce((acc, f) => acc + (f.metadata?.size || f.size || 0), 0)
        setTotalStorageSize(total)

        // Find orphaned files (not referenced by any product image_url)
        const productImages = products
          .map((p) => p.image_url)
          .filter(Boolean)

        const orphaned = files.filter((f) => {
          const fileFullPath = `products/${f.name}`
          return !productImages.some((url) => url.includes(fileFullPath))
        })
        setOrphanedFiles(orphaned)
      }
    } catch (err) {
      console.error('Erro ao buscar estatísticas de armazenamento:', err)
    } finally {
      setIsStorageLoading(false)
    }
  }

  const handleCleanOrphanedFiles = async () => {
    if (orphanedFiles.length === 0) return
    setIsCleaningStorage(true)
    try {
      const pathsToDelete = orphanedFiles.map((f) => `products/${f.name}`)
      const { error } = await supabase.storage.from('product-images').remove(pathsToDelete)
      if (error) throw error
      alert(`${orphanedFiles.length} imagens órfãs foram excluídas com sucesso para liberar espaço!`)
      await fetchStorageStats()
    } catch (err) {
      alert('Erro ao excluir imagens órfãs: ' + err.message)
    } finally {
      setIsCleaningStorage(false)
    }
  }

  React.useEffect(() => {
    if (activeTab === 'storage') {
      fetchStorageStats()
    }
  }, [activeTab, products])

  // Handle Product Create/Update Form Submission
  const handleProductSubmit = async (formData) => {
    setIsProductSaving(true)
    try {
      if (editingProduct) {
        // Edit flow - if image changed, delete old image from storage
        if (editingProduct.image_url && editingProduct.image_url !== formData.image_url) {
          try {
            const parts = editingProduct.image_url.split('/product-images/')
            if (parts.length > 1) {
              const filename = parts[1]
              await supabase.storage.from('product-images').remove([filename])
            }
          } catch (storageErr) {
            console.error('Erro ao deletar imagem antiga do storage:', storageErr)
          }
        }
        await updateProduct({ id: editingProduct.id, ...formData })
      } else {
        // Create flow
        await createProduct(formData)
      }
      setIsProductModalOpen(false)
      setEditingProduct(null)
    } catch (err) {
      alert('Erro ao salvar produto: ' + err.message)
    } finally {
      setIsProductSaving(false)
    }
  }

  // Toggle availability state directly
  const handleToggleAvailability = async (product) => {
    try {
      await updateProduct({ id: product.id, available: !product.available })
    } catch (err) {
      alert('Erro ao alterar status: ' + err.message)
    }
  }

  // Handle Product Delete Confirmation
  const handleConfirmDeleteProduct = async () => {
    if (!deletingProduct) return
    setIsProductDeleting(true)
    try {
      // Delete associated image from storage if it exists
      if (deletingProduct.image_url) {
        try {
          const parts = deletingProduct.image_url.split('/product-images/')
          if (parts.length > 1) {
            const filename = parts[1]
            await supabase.storage.from('product-images').remove([filename])
          }
        } catch (storageErr) {
          console.error('Erro ao deletar imagem do storage:', storageErr)
        }
      }
      await deleteProduct(deletingProduct.id)
      setDeletingProduct(null)
    } catch (err) {
      alert('Erro ao excluir produto: ' + err.message)
    } finally {
      setIsProductDeleting(false)
    }
  }

  // Handle Category Creation
  const handleCreateCategory = async (e) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    setIsCreatingCategory(true)
    try {
      const slug = slugify(newCatName)
      await createCategory({
        name: newCatName.trim(),
        slug,
        display_order: parseInt(newCatOrder) || 0,
      })
      setNewCatName('')
      setNewCatOrder('0')
    } catch (err) {
      alert('Erro ao criar categoria: ' + err.message)
    } finally {
      setIsCreatingCategory(false)
    }
  }

  // Start Editing Category Inline
  const startEditingCategory = (category) => {
    setEditingCategoryId(category.id)
    setEditingCatName(category.name)
    setEditingCatOrder(category.display_order.toString())
  }

  // Save Inline Category changes
  const handleUpdateCategory = async (id) => {
    if (!editingCatName.trim()) return
    setIsUpdatingCategory(true)
    try {
      const slug = slugify(editingCatName)
      await updateCategory({
        id,
        name: editingCatName.trim(),
        slug,
        display_order: parseInt(editingCatOrder) || 0,
      })
      setEditingCategoryId(null)
    } catch (err) {
      alert('Erro ao salvar categoria: ' + err.message)
    } finally {
      setIsUpdatingCategory(false)
    }
  }

  // Handle Category Delete Confirmation
  const handleConfirmDeleteCategory = async () => {
    if (!deletingCategory) return
    setIsCategoryDeleting(true)
    try {
      await deleteCategory(deletingCategory.id)
      setDeletingCategory(null)
    } catch (err) {
      alert('Erro ao excluir categoria: ' + err.message)
    } finally {
      setIsCategoryDeleting(false)
    }
  }

  // Handle New Admin User Registration
  const handleCreateUser = async (e) => {
    e.preventDefault()
    setUserCreationMessage(null)
    setUserCreationError(null)

    if (!newUserEmail.trim() || !newUserPassword || !newUserConfirmPassword) {
      setUserCreationError('Por favor, preencha todos os campos.')
      return
    }

    if (!newUserEmail.includes('@')) {
      setUserCreationError('Por favor, digite um e-mail válido contendo @.')
      return
    }

    if (newUserPassword.length < 6) {
      setUserCreationError('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    if (newUserPassword !== newUserConfirmPassword) {
      setUserCreationError('As senhas digitadas não coincidem.')
      return
    }

    setIsCreatingUser(true)
    try {
      // Instanciamos um cliente secundário para registrar o novo usuário sem interferir na sessão ativa!
      const registerClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
          }
        }
      )

      const { data, error } = await registerClient.auth.signUp({
        email: newUserEmail.trim(),
        password: newUserPassword,
        options: {
          data: {
            role: 'admin'
          }
        }
      })

      if (error) throw error

      setUserCreationMessage(
        `Usuário "${newUserEmail.trim()}" cadastrado com sucesso! Se ele constar como pendente no painel do Supabase, lembre-se de confirmar o e-mail em (Authentication -> Users -> Confirm User) ou desabilitar o Email Double Opt-In nas configurações.`
      )
      setNewUserEmail('')
      setNewUserPassword('')
      setNewUserConfirmPassword('')
    } catch (err) {
      console.error('Erro ao cadastrar administrador:', err)
      setUserCreationError(err.message || 'Falha ao cadastrar novo administrador.')
    } finally {
      setIsCreatingUser(false)
    }
  }

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  const formatBrl = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-ui text-slate-800">
      {/* Top Navbar */}
      <header className="bg-navy-dark text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-0.5 border border-gold rounded-full bg-navy-dark">
            <HotelLogo size={42} borderColor="var(--gold)" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide font-display text-ivory">
              Painel Administrativo
            </h1>
            <p className="text-[10px] text-gold tracking-widest uppercase">
              Restaurante Don Fernando
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-white hover:text-gold rounded-admin text-xs font-semibold transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            Visualizar Cardápio
          </a>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/20 hover:bg-red-950/40 text-red-300 border border-red-900/30 hover:border-red-950 rounded-admin text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-4 py-3 rounded-admin text-xs uppercase tracking-widest font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'products' ? 'bg-navy text-white' : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Utensils className="w-4 h-4" />
            Produtos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full text-left px-4 py-3 rounded-admin text-xs uppercase tracking-widest font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'categories' ? 'bg-navy text-white' : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Grid className="w-4 h-4" />
            Categorias
          </button>
          <button
            onClick={() => setActiveTab('qrcode')}
            className={`w-full text-left px-4 py-3 rounded-admin text-xs uppercase tracking-widest font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'qrcode' ? 'bg-navy text-white' : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            QR Code
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-3 rounded-admin text-xs uppercase tracking-widest font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'users' ? 'bg-navy text-white' : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Administradores
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`w-full text-left px-4 py-3 rounded-admin text-xs uppercase tracking-widest font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'storage' ? 'bg-navy text-white' : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            Banco & Mídia
          </button>
        </aside>

        {/* Content Box */}
        <main className="flex-grow bg-white border border-slate-200 rounded-admin shadow-sm p-4 md:p-6 overflow-x-hidden">
          {/* TAB 1: PRODUCTS */}
          {activeTab === 'products' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Gerenciar Pratos</h2>
                  <p className="text-xs text-slate-500">Crie, edite e altere a disponibilidade dos itens no cardápio público.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null)
                    setIsProductModalOpen(true)
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-navy hover:bg-navy-mid text-white rounded-admin text-xs uppercase tracking-widest font-semibold shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Novo Produto
                </button>
              </div>

              {isLoadingProducts || isLoadingCategories ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-navy animate-spin mb-3" />
                  <p className="text-sm font-medium text-slate-500">Carregando produtos...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-admin">
                  <Utensils className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-slate-800">Nenhum produto cadastrado</h3>
                  <p className="text-xs text-slate-400 mt-1 mb-4">Clique no botão acima para adicionar seu primeiro prato.</p>
                </div>
              ) : (
                /* Products Table */
                <div className="overflow-x-auto border border-slate-100 rounded-lg">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 text-[10px] uppercase tracking-wider font-semibold">
                        <th className="py-3.5 px-4 w-16">Foto</th>
                        <th className="py-3.5 px-4">Nome</th>
                        <th className="py-3.5 px-4 w-36">Categoria</th>
                        <th className="py-3.5 px-4 w-28 text-right">Preço</th>
                        <th className="py-3.5 px-4 w-24 text-center">Status</th>
                        <th className="py-3.5 px-4 w-24 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 text-xs">
                      {products.map((prod) => {
                        const cat = categories.find((c) => c.id === prod.category_id)
                        return (
                          <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                            {/* Thumbnail */}
                            <td className="py-3 px-4">
                              {prod.image_url ? (
                                <img
                                  src={prod.image_url}
                                  alt={prod.name}
                                  className="w-10 h-10 object-cover rounded border border-slate-200"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded flex items-center justify-center text-slate-400">
                                  <Utensils className="w-4 h-4" />
                                </div>
                              )}
                            </td>
                            {/* Name & description */}
                            <td className="py-3 px-4 max-w-xs md:max-w-md">
                              <div className="font-bold text-slate-900">{prod.name}</div>
                              {prod.description && (
                                <div className="text-[10px] text-slate-400 truncate mt-0.5" title={prod.description}>
                                  {prod.description}
                                </div>
                              )}
                            </td>
                            {/* Category name */}
                            <td className="py-3 px-4 text-slate-605 font-medium">
                               {cat ? (
                                 <div className="flex flex-col gap-1 items-start">
                                   <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] border border-slate-150 font-semibold">
                                     {cat.name}
                                   </span>
                                   {prod.subcategory && (
                                     <span className="text-[10px] text-slate-400 font-medium ml-1">
                                       ➔ {prod.subcategory}
                                     </span>
                                   )}
                                 </div>
                               ) : (
                                 <span className="text-slate-400 italic text-[10px]">Sem categoria</span>
                               )}
                             </td>
                            {/* Price */}
                            <td className="py-3 px-4 text-right font-semibold text-slate-900">
                              {formatBrl(prod.price)}
                            </td>
                            {/* Available toggle switch */}
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleToggleAvailability(prod)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                                  prod.available
                                    ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                                    : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                                }`}
                                title={prod.available ? 'Disponível. Clique para desativar' : 'Indisponível. Clique para ativar'}
                              >
                                {prod.available ? (
                                  <>
                                    <Eye className="w-3 h-3" />
                                    Ativo
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3 h-3" />
                                    Pausado
                                  </>
                                )}
                              </button>
                            </td>
                            {/* Actions edit / delete */}
                            <td className="py-3 px-4">
                              <div className="flex justify-center items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingProduct(prod)
                                    setIsProductModalOpen(true)
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-navy hover:bg-slate-100 rounded transition-colors"
                                  title="Editar prato"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeletingProduct(prod)}
                                  className="p-1.5 text-slate-500 hover:text-red-650 hover:bg-red-50 rounded transition-colors"
                                  title="Excluir prato"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CATEGORIES */}
          {activeTab === 'categories' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900">Gerenciar Categorias</h2>
                <p className="text-xs text-slate-500">Agrupe seus pratos (Ex: Entradas, Carnes, Sobremesas, Bebidas).</p>
              </div>

              {/* Quick Create Category Form */}
              <form onSubmit={handleCreateCategory} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 border border-slate-200 rounded-admin p-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Nome da Categoria
                  </label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Ex: Entradas Especiais"
                    disabled={isCreatingCategory}
                    className="w-full px-3 py-2 border border-slate-350 rounded-admin text-sm bg-white focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Ordem de Exibição
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newCatOrder}
                      onChange={(e) => setNewCatOrder(e.target.value)}
                      placeholder="0"
                      disabled={isCreatingCategory}
                      className="w-20 px-3 py-2 border border-slate-350 rounded-admin text-sm bg-white focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy text-center"
                    />
                    <button
                      type="submit"
                      disabled={isCreatingCategory || !newCatName.trim()}
                      className="flex-grow flex items-center justify-center gap-1 px-4 py-2 bg-navy hover:bg-navy-mid text-white rounded-admin text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50"
                    >
                      {isCreatingCategory ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                      Adicionar
                    </button>
                  </div>
                </div>
              </form>

              {isLoadingCategories ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 text-navy animate-spin mb-3" />
                  <p className="text-sm font-medium text-slate-500">Carregando categorias...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-admin text-slate-400">
                  <Grid className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs">Nenhuma categoria criada ainda.</p>
                </div>
              ) : (
                /* Inline Categories List */
                <div className="border border-slate-200 rounded-admin overflow-hidden divide-y divide-slate-200">
                  {categories.map((cat) => {
                    const isEditing = editingCategoryId === cat.id
                    return (
                      <div
                        key={cat.id}
                        className={`p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 transition-colors ${
                          isEditing ? 'bg-navy-light/10' : 'hover:bg-slate-50/50'
                        }`}
                      >
                        {isEditing ? (
                          /* INLINE EDIT MODE */
                          <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                            <div className="md:col-span-8">
                              <input
                                type="text"
                                value={editingCatName}
                                onChange={(e) => setEditingCatName(e.target.value)}
                                disabled={isUpdatingCategory}
                                className="w-full px-3 py-1.5 border border-navy rounded bg-white text-sm focus:outline-none"
                              />
                            </div>
                            <div className="md:col-span-4 flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Ordem:</span>
                              <input
                                type="number"
                                value={editingCatOrder}
                                onChange={(e) => setEditingCatOrder(e.target.value)}
                                disabled={isUpdatingCategory}
                                className="w-16 px-2 py-1.5 border border-navy rounded text-center text-sm bg-white"
                              />
                              <div className="flex items-center gap-1.5 ml-auto">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateCategory(cat.id)}
                                  disabled={isUpdatingCategory || !editingCatName.trim()}
                                  className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                                  title="Confirmar alterações"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingCategoryId(null)}
                                  disabled={isUpdatingCategory}
                                  className="p-1.5 bg-slate-300 hover:bg-slate-400 text-slate-800 rounded transition-colors"
                                  title="Cancelar"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* STANDARD DISPLAY ROW */
                          <>
                            <div className="flex items-center gap-3">
                              <Grid className="w-4 h-4 text-slate-400" />
                              <div>
                                <span className="font-bold text-slate-800 text-sm">{cat.name}</span>
                                <span className="text-[10px] text-slate-400 ml-2">slug: {cat.slug}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between md:justify-end gap-6">
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                <ListOrdered className="w-3.5 h-3.5 text-slate-450" />
                                <span>Ordem: {cat.display_order}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => startEditingCategory(cat)}
                                  className="p-1.5 text-slate-500 hover:text-navy hover:bg-slate-100 rounded transition-colors"
                                  title="Editar categoria"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeletingCategory(cat)}
                                  className="p-1.5 text-slate-500 hover:text-red-650 hover:bg-red-50 rounded transition-colors"
                                  title="Excluir categoria"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: QR CODE GENERATOR */}
          {activeTab === 'qrcode' && (
            <div className="max-w-md mx-auto py-6">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-slate-900">QR Code do Cardápio</h2>
                <p className="text-xs text-slate-500">Imprima este QR Code e espalhe nas mesas do restaurante ou nos quartos do hotel.</p>
              </div>
              <div className="border border-slate-200 rounded-admin p-6 bg-slate-50">
                <QRCodeDisplay />
              </div>
            </div>
          )}

          {/* TAB 4: USERS / ADMINISTRATORS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="max-w-lg mx-auto py-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900">Cadastrar Administradores</h2>
                <p className="text-xs text-slate-500">
                  Cadastre novos e-mails e senhas de acesso para que outras pessoas (ou os proprietários do hotel) possam gerenciar o cardápio.
                </p>
              </div>

              {userCreationMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-admin text-xs text-green-800 leading-relaxed">
                  <div className="font-bold mb-1">🎉 Sucesso!</div>
                  {userCreationMessage}
                </div>
              )}

              {userCreationError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-admin text-xs text-red-800 leading-relaxed">
                  <div className="font-bold mb-1">❌ Erro ao cadastrar:</div>
                  {userCreationError}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-4 bg-slate-50 border border-slate-200 rounded-admin p-6 shadow-sm">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    E-mail do Novo Administrador
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="Ex: proprietario@hotelsaoluiz.com"
                    disabled={isCreatingUser}
                    className="w-full px-3 py-2 border border-slate-350 rounded-admin text-sm bg-white focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Senha de Acesso
                    </label>
                    <input
                      type="password"
                      required
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      disabled={isCreatingUser}
                      className="w-full px-3 py-2 border border-slate-350 rounded-admin text-sm bg-white focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Confirmar Senha
                    </label>
                    <input
                      type="password"
                      required
                      value={newUserConfirmPassword}
                      onChange={(e) => setNewUserConfirmPassword(e.target.value)}
                      placeholder="Repita a senha"
                      disabled={isCreatingUser}
                      className="w-full px-3 py-2 border border-slate-350 rounded-admin text-sm bg-white focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="w-full py-2.5 mt-2 bg-navy hover:bg-navy-mid text-white font-ui font-semibold rounded-admin text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isCreatingUser ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cadastrando Administrador...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Cadastrar Administrador
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: DATABASE & STORAGE */}
          {activeTab === 'storage' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Banco de Dados & Mídia</h2>
                  <p className="text-xs text-slate-500">
                    Monitore o consumo de recursos e limpe arquivos inúteis para manter seu plano 100% gratuito.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchStorageStats}
                  disabled={isStorageLoading}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:border-navy text-slate-700 hover:text-navy rounded-admin text-xs font-semibold bg-white transition-all disabled:opacity-50"
                >
                  <Loader2 className={`w-3.5 h-3.5 ${isStorageLoading ? 'animate-spin' : ''}`} />
                  Atualizar
                </button>
              </div>

              {isStorageLoading && storageFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-navy animate-spin mb-3" />
                  <p className="text-sm font-medium text-slate-500">Carregando estatísticas do servidor...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Database Card */}
                    <div className="bg-white border border-slate-200 rounded-admin p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <Database className="w-5 h-5 text-navy" />
                          <h3 className="font-bold text-slate-800 text-sm">Banco de Dados (PostgreSQL)</h3>
                        </div>
                        <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                          Ativo
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Uso Total:</span>
                          <span className="font-bold text-slate-800">
                            {dbSizeExact 
                              ? formatBytes(dbSizeExact) 
                              : `~${formatBytes((products.length * 512) + (categories.length * 128) + 102400)} (Estimado)`
                            }
                          </span>
                        </div>

                        {/* Progress Bar (Limit is 500MB = 524288000 bytes) */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-navy transition-all duration-500" 
                            style={{ 
                              width: `${Math.min(
                                100, 
                                ((dbSizeExact || ((products.length * 512) + (categories.length * 128) + 102400)) / 524288000) * 100
                              )}%` 
                            }}
                          />
                        </div>

                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>0 Bytes</span>
                          <span>Limite Grátis: 500 MB</span>
                        </div>
                      </div>

                      <div className="bg-slate-50/50 rounded p-3 text-[11px] text-slate-600 leading-relaxed border border-slate-100">
                        <p>
                          O banco de dados armazena os nomes dos pratos, categorias, administradores, descrições e textos. 
                          Graças à nossa arquitetura otimizada, o consumo é extremamente baixo.
                        </p>
                      </div>

                      {/* SQL Instructions Toggle */}
                      <div className="pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setShowSqlInstructions(!showSqlInstructions)}
                          className="text-[10px] font-bold text-navy hover:underline flex items-center gap-1 uppercase tracking-wider"
                        >
                          {showSqlInstructions ? '▼ Ocultar Instruções de Conexão' : '▶ Ver Instruções de Conexão Real (Postgres SQL)'}
                        </button>

                        {showSqlInstructions && (
                          <div className="mt-3 p-3 bg-slate-900 text-slate-350 rounded text-[10px] font-mono leading-relaxed space-y-2 border border-slate-850 select-all">
                            <p className="text-gold font-bold text-[9px]">-- Execute isto no Supabase SQL Editor para ver a medição real:</p>
                            <pre className="overflow-x-auto whitespace-pre p-2 bg-black/40 rounded text-slate-200">
{`CREATE OR REPLACE FUNCTION get_db_size()
RETURNS json AS $$
DECLARE
    db_size bigint;
BEGIN
    SELECT pg_database_size(current_database()) INTO db_size;
    RETURN json_build_object('database_size_bytes', db_size);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`}
                            </pre>
                            <p className="text-slate-500">
                              Isso cria uma função RPC segura. Ao criá-la, o painel passará a medir o tamanho exato em bytes em tempo real!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Storage Card */}
                    <div className="bg-white border border-slate-200 rounded-admin p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-5 h-5 text-navy" />
                          <h3 className="font-bold text-slate-800 text-sm">Armazenamento de Mídia (Imagens)</h3>
                        </div>
                        <span className="text-[10px] font-bold text-navy-dark bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full flex-shrink-0">
                          {storageFiles.length} Arquivos
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Uso Total:</span>
                          <span className="font-bold text-slate-800">{formatBytes(totalStorageSize)}</span>
                        </div>

                        {/* Progress Bar (Limit is 1GB = 1073741824 bytes) */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gold transition-all duration-500" 
                            style={{ width: `${Math.min(100, (totalStorageSize / 1073741824) * 100)}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>0 Bytes</span>
                          <span>Limite Grátis: 1.0 GB</span>
                        </div>
                      </div>

                      <div className="bg-slate-50/50 rounded p-3 text-[11px] text-slate-600 leading-relaxed border border-slate-100 space-y-1.5">
                        <p>
                          Armazena as fotos enviadas para os produtos no bucket <code className="bg-slate-150 px-1 py-0.5 rounded text-navy font-semibold">product-images</code>.
                        </p>
                        <p className="font-semibold text-green-700">
                          ✓ Otimização Ativa: As imagens são redimensionadas para exatamente 800x600px no seu navegador antes do upload, pesando apenas ~70 KB cada (mais de 15.000 imagens cabem no limite!).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Garbage Collector / Orphaned Files Card */}
                  <div className="bg-white border border-slate-200 rounded-admin p-5 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-slate-800 text-sm">Limpeza de Disco e Imagens Órfãs</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Apague imagens antigas que não estão sendo usadas por nenhum prato do cardápio para liberar espaço no Supabase.
                      </p>
                    </div>

                    {orphanedFiles.length === 0 ? (
                      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-admin text-green-800">
                        <div className="p-1.5 bg-green-600 text-white rounded-full flex-shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider">Armazenamento Limpo</h4>
                          <p className="text-[11px] mt-0.5 text-green-700">
                            Excelente! Todas as imagens presentes no Supabase estão ativas e vinculadas a produtos reais no cardápio. Não há lixo ou arquivos órfãos.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-admin text-yellow-850">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider">Lixo Identificado no Servidor</h4>
                            <p className="text-[11px] mt-0.5 text-yellow-750">
                              Detectamos <strong>{orphanedFiles.length} imagens órfãs</strong> (arquivos inúteis de pratos deletados ou editados no passado) ocupando cerca de <strong>{formatBytes(orphanedFiles.reduce((acc, f) => acc + (f.metadata?.size || f.size || 0), 0))}</strong> no total.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleCleanOrphanedFiles}
                            disabled={isCleaningStorage}
                            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-red-650 hover:bg-red-755 text-white rounded-admin text-xs uppercase tracking-widest font-semibold shadow-sm transition-colors disabled:opacity-50 flex-shrink-0"
                          >
                            {isCleaningStorage ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                            Excluir {orphanedFiles.length} Imagens Órfãs
                          </button>
                        </div>

                        {/* List of orphaned files */}
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                          <div className="bg-slate-50 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                            Arquivos Órfãos Encontrados
                          </div>
                          <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
                            {orphanedFiles.map((file) => (
                              <div key={file.id} className="px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-650 hover:bg-slate-50/50">
                                <span className="font-mono truncate max-w-xs md:max-w-md" title={file.name}>
                                  {file.name}
                                </span>
                                <span className="font-semibold text-slate-800 flex-shrink-0 ml-4">
                                  {formatBytes(file.metadata?.size || file.size || 0)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* PRODUCT FORM MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={isProductSaving ? undefined : () => setIsProductModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-admin shadow-xl p-6 z-10 overflow-y-auto max-h-[90vh]">
            <h3 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </h3>
            <ProductForm
              initialData={editingProduct}
              categories={categories}
              onSubmit={handleProductSubmit}
              onCancel={() => setIsProductModalOpen(false)}
              isSaving={isProductSaving}
            />
          </div>
        </div>
      )}

      {/* CONFIRM DELETE PRODUCT DIALOG */}
      <ConfirmDialog
        isOpen={!!deletingProduct}
        title="Excluir Produto"
        description={`Tem certeza que deseja excluir o prato "${deletingProduct?.name}"? Esta ação é irreversível.`}
        onConfirm={handleConfirmDeleteProduct}
        onCancel={() => setDeletingProduct(null)}
        isConfirming={isProductDeleting}
      />

      {/* CONFIRM DELETE CATEGORY DIALOG */}
      <ConfirmDialog
        isOpen={!!deletingCategory}
        title="Excluir Categoria"
        description={`Tem certeza que deseja excluir a categoria "${deletingCategory?.name}"? Qualquer prato associado ficará temporariamente classificado como "Sem Categoria".`}
        onConfirm={handleConfirmDeleteCategory}
        onCancel={() => setDeletingCategory(null)}
        isConfirming={isCategoryDeleting}
      />
    </div>
  )
}

export default Admin
