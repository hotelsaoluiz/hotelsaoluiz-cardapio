import React from 'react'
import { 
  CupSoda, 
  UtensilsCrossed, 
  Pizza, 
  Soup, 
  Fish, 
  Beef, 
  Wheat, 
  Cake,
  Utensils
} from 'lucide-react'

// Helper function mapping category names to visual icons dynamically
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase()
  if (name.includes('bebida')) return <CupSoda size={13} style={{ flexShrink: 0 }} />
  if (name.includes('entrada') || name.includes('petisco')) return <UtensilsCrossed size={13} style={{ flexShrink: 0 }} />
  if (name.includes('grelhado') || name.includes('carne')) return <Beef size={13} style={{ flexShrink: 0 }} />
  if (name.includes('peixe') || name.includes('mar')) return <Fish size={13} style={{ flexShrink: 0 }} />
  if (name.includes('massa') || name.includes('risoto')) return <Wheat size={13} style={{ flexShrink: 0 }} />
  if (name.includes('sopa')) return <Soup size={13} style={{ flexShrink: 0 }} />
  if (name.includes('lanche')) return <Pizza size={13} style={{ flexShrink: 0 }} />
  if (name.includes('sobremesa')) return <Cake size={13} style={{ flexShrink: 0 }} />
  return <Utensils size={13} style={{ flexShrink: 0 }} />
}

export function CategoryNav({ categories, activeCategoryId, onSelectCategory }) {
  return (
    <nav
      className="category-nav-scroll"
      style={{
        backgroundColor: 'var(--navy)',
        borderBottom: '1px solid rgba(201,168,76,0.3)',
        display: 'flex',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        width: '100%',
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none', /* IE/Edge */
      }}
    >
      <style>{`
        .category-nav-scroll::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }
        @media (min-width: 768px) {
          .category-nav-scroll {
            justify-content: center;
          }
        }
      `}</style>

      {categories.map((category) => {
        const isActive = activeCategoryId === category.id
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '10px', // Slightly larger font-size for better senior readability
              fontWeight: isActive ? '600' : '400',
              letterSpacing: '0.15em', // slightly reduced from 0.22em to accommodate the icon beautifully
              textTransform: 'uppercase',
              padding: '12px 18px', // slightly increased vertical padding
              border: 'none',
              borderRadius: '0px', // Strict border-radius 0
              backgroundColor: 'transparent',
              color: isActive ? 'var(--gold)' : 'rgba(255, 255, 255, 0.65)',
              borderBottom: isActive ? '2px solid var(--gold)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'color 200ms ease, border-color 200ms ease',
              outline: 'none',
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px', // spacing between icon and text label
            }}
          >
            {getCategoryIcon(category.name)}
            <span>{category.name}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default CategoryNav
