import React from 'react'

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
      `}</style>

      {categories.map((category) => {
        const isActive = activeCategoryId === category.id
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '9px',
              fontWeight: isActive ? '600' : '400',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              padding: '11px 18px',
              border: 'none',
              borderRadius: '0px', // Strict border-radius 0
              backgroundColor: 'transparent',
              color: isActive ? 'var(--gold)' : 'rgba(255, 255, 255, 0.5)',
              borderBottom: isActive ? '2px solid var(--gold)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'color 200ms ease, border-color 200ms ease',
              outline: 'none',
              flexShrink: 0,
            }}
          >
            {category.name}
          </button>
        )
      })}
    </nav>
  )
}

export default CategoryNav
