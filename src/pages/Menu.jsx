import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCategories } from '../hooks/useCategories'
import { useProducts } from '../hooks/useProducts'
import DecoHeader from '../components/menu/DecoHeader'
import CategoryNav from '../components/menu/CategoryNav'
import SectionDivider from '../components/menu/SectionDivider'
import ProductCard from '../components/menu/ProductCard'

export function Menu() {
  const { categories, isLoading: isLoadingCategories, error: errorCategories } = useCategories()
  const { products, isLoading: isLoadingProducts, error: errorProducts } = useProducts()
  
  const [activeCategoryId, setActiveCategoryId] = useState('')

  // Automatically select the first category once categories load
  useEffect(() => {
    if (categories && categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id)
    }
  }, [categories, activeCategoryId])

  const handleSelectCategory = (categoryId) => {
    setActiveCategoryId(categoryId)
    const element = document.getElementById(`category-section-${categoryId}`)
    if (element) {
      const offset = 48 // Approximate height of the sticky CategoryNav
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const isLoading = isLoadingCategories || isLoadingProducts
  // Silent error state for client: no raw logs or stacks, just a clean empty cardapio state
  const hasError = errorCategories || errorProducts

  // Filter products by category to verify layout groups
  const getProductsByCategory = (categoryId) => {
    return products.filter((prod) => prod.category_id === categoryId)
  }

  // Pure Skeleton Loader conforming to requirements
  const SkeletonLoader = () => (
    <div 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
        gap: '12px',
        width: '100%'
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="skeleton-item"
          style={{
            aspectRatio: '4/3',
            background: 'var(--navy-light)',
            opacity: 0.4,
            borderRadius: '0px',
            animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </div>
  )

  return (
    <div
      style={{
        backgroundColor: 'var(--white)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. DecoHeader at the top */}
      <DecoHeader />

      {/* 2. CategoryNav sticky top: 0, z-index: 10 */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          width: '100%',
        }}
      >
        {!isLoading && !hasError && categories.length > 0 && (
          <CategoryNav
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelectCategory={handleSelectCategory}
          />
        )}
      </div>

      {/* 3. Main Menu Content area: padding 0 16px 40px */}
      <main
        style={{
          padding: '0 16px 40px',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
          flexGrow: 1,
        }}
      >
        {isLoading ? (
          <div style={{ marginTop: '24px' }}>
            <SkeletonLoader />
          </div>
        ) : hasError || categories.length === 0 ? (
          /* Silent Empty state instead of crashing errors */
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              fontFamily: 'var(--font-ui)',
              color: 'var(--bronze)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                fontStyle: 'italic',
                color: 'var(--navy)',
                marginBottom: '10px',
              }}
            >
              Cardápio Indisponível
            </span>
            <p style={{ fontSize: '10px', letterSpacing: '0.05em', maxWidth: '300px', lineHeight: '1.6' }}>
              Nosso cardápio digital está sendo atualizado. Por favor, solicite a versão física ao garçom ou tente novamente mais tarde.
            </p>
          </div>
        ) : (
          /* Category Sections and Product Cards */
          categories.map((category) => {
            const categoryProducts = getProductsByCategory(category.id)
            if (categoryProducts.length === 0) return null

            return (
              <section
                key={category.id}
                id={`category-section-${category.id}`}
                style={{ scrollMarginTop: '60px' }} // Provides breathing space after scrolling
              >
                {/* Category Title Segment Divider */}
                <SectionDivider title={category.name} />

                {/* Grid matching repeat(auto-fit, minmax(260px, 1fr)) and 12px gap */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )
          })
        )}
      </main>

      {/* Footer matching colors */}
      <footer
        style={{
          backgroundColor: 'var(--navy-dark)',
          borderTop: '1px solid var(--gold)',
          padding: '24px 16px',
          textAlign: 'center',
          marginTop: 'auto',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '8px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--gold-light)',
            margin: 0,
          }}
        >
          © {new Date().getFullYear()} {import.meta.env.VITE_HOTEL_NAME || 'Hotel São Luiz'}. Todos os direitos reservados.
        </p>

        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '7px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--gold-pale)',
            opacity: 0.65,
            margin: '6px 0 0 0',
          }}
        >
          Desenvolvido por IP6 Networks
        </p>

        <Link
          to="/login"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '7px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--gold-pale)',
            textDecoration: 'none',
            display: 'inline-block',
            marginTop: '12px',
            opacity: 0.35,
            transition: 'opacity 200ms ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.35'}
        >
          Acesso Restrito
        </Link>
      </footer>
    </div>
  )
}

export default Menu
