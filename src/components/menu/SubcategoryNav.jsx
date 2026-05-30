import React from 'react'

export function SubcategoryNav({ subcategories, activeSubcategory, onSelectSubcategory }) {
  if (!subcategories || subcategories.length <= 1) return null

  return (
    <div
      className="subcategory-nav-scroll"
      style={{
        backgroundColor: 'var(--navy-light)',
        borderBottom: '1px solid rgba(201,168,76,0.15)',
        display: 'flex',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        width: '100%',
        padding: '8px 12px',
        boxSizing: 'border-box',
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none', /* IE/Edge */
        gap: '8px',
      }}
    >
      <style>{`
        .subcategory-nav-scroll::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }
      `}</style>

      {/* "Todos" Option */}
      <button
        onClick={() => onSelectSubcategory('')}
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '9px',
          fontWeight: activeSubcategory === '' ? '600' : '400',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          padding: '6px 12px',
          border: activeSubcategory === '' ? '1px solid var(--gold)' : '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '0px', // Strict border-radius 0
          backgroundColor: activeSubcategory === '' ? 'var(--gold)' : 'transparent',
          color: activeSubcategory === '' ? 'var(--navy-dark)' : 'rgba(255, 255, 255, 0.75)',
          cursor: 'pointer',
          transition: 'all 200ms ease',
          outline: 'none',
          flexShrink: 0,
        }}
      >
        Todos
      </button>

      {subcategories.map((sub) => {
        const isActive = activeSubcategory === sub
        return (
          <button
            key={sub}
            onClick={() => onSelectSubcategory(sub)}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '9px',
              fontWeight: isActive ? '600' : '400',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '6px 12px',
              border: isActive ? '1px solid var(--gold)' : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0px', // Strict border-radius 0
              backgroundColor: isActive ? 'var(--gold)' : 'transparent',
              color: isActive ? 'var(--navy-dark)' : 'rgba(255, 255, 255, 0.75)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              outline: 'none',
              flexShrink: 0,
            }}
          >
            {sub}
          </button>
        )
      })}
    </div>
  )
}

export default SubcategoryNav
