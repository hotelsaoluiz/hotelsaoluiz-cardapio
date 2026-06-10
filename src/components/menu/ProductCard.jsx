import React, { useState } from 'react'

export function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)

  const {
    name,
    description,
    price,
    image_url,
    available,
  } = product

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'row', // Horizontal List Layout
        height: '100%',
        backgroundColor: isHovered ? 'var(--navy-light)' : 'var(--bg-card)',
        border: 'var(--border-navy)',
        borderTop: '2px solid var(--navy)',
        borderRadius: '0px', // Strict radius 0 for public menu elements
        borderBottom: '1px solid rgba(201,168,76,0.25)',
        borderColor: isHovered ? 'rgba(30,42,122,0.35)' : 'rgba(30,42,122,0.15)',
        transition: 'background-color 200ms ease, border-color 200ms ease',
        overflow: 'hidden',
      }}
    >
      {/* Card Content Area - Text on the left, takes remaining space */}
      <div
        style={{
          padding: '16px', // Increased padding for horizontal layout
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'space-between',
          minWidth: 0, // Allows text truncation to work if needed later
        }}
      >
        <div>
          {/* Product Header & Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '6px',
              marginBottom: '8px',
            }}
          >
            {/* Availability Badges */}
            {available ? (
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '10px',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--navy-mid)',
                  padding: '2px 6px',
                  border: '1px solid rgba(42,58,158,0.35)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Disponível
              </span>
            ) : (
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '10px',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--bronze)',
                  padding: '2px 6px',
                  border: '1px solid rgba(138,128,112,0.45)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Esgotado
              </span>
            )}

            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px', 
                fontWeight: '600', 
                color: 'var(--navy-dark)',
                margin: 0,
                lineHeight: '1.25',
              }}
            >
              {name}
            </h4>
          </div>

          {/* Description */}
          {description && (
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '12px',
                letterSpacing: '0.04em',
                lineHeight: '1.5',
                color: 'var(--bronze)',
                margin: '0 0 12px 0',
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Price Display */}
        {price > 0 && (
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '21px',
                fontWeight: '600',
                color: 'var(--navy)',
              }}
            >
              {formattedPrice}
            </span>
          </div>
        )}
      </div>

      {/* Product Image Area - Placed on the right side if exists */}
      {image_url && (
        <div style={{ 
          position: 'relative', 
          width: '120px', // Fixed width for image column
          minHeight: '120px', // Ensures a minimum height even if text is very short
          flexShrink: 0, // Prevent image from shrinking
          borderLeft: '1px solid rgba(201,168,76,0.15)',
          backgroundColor: 'var(--bg-surface)'
        }}>
          <img
            src={image_url}
            alt={name}
            loading="lazy"
            decoding="async"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {/* Decorative Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(30,42,122,0.06)',
              pointerEvents: 'none',
            }}
          />
        </div>
      )}
    </article>
  )
}

export default ProductCard
