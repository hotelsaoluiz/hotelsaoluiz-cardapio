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
        flexDirection: 'column',
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
      {/* Product Image with Overlay */}
      {image_url ? (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
          <img
            src={image_url}
            alt={name}
            loading="lazy"
            decoding="async"
            style={{
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
      ) : (
        /* Fallback placeholder matching layout aspect-ratio */
        <div
          style={{
            width: '100%',
            aspectRatio: '4/3',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--bronze)',
            fontFamily: 'var(--font-ui)',
            fontSize: '9px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            borderBottom: '1px solid rgba(201,168,76,0.1)',
          }}
        >
          Sem Imagem
        </div>
      )}

      {/* Card Content Area */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Product Header & Title */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '10px',
              marginBottom: '8px',
            }}
          >
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '17px',
                fontWeight: '400',
                color: 'var(--navy-dark)',
                margin: 0,
                lineHeight: '1.2',
              }}
            >
              {name}
            </h4>

            {/* Availability Badges */}
            {available ? (
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '8px',
                  fontWeight: '600',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--navy-mid)',
                  padding: '3px 8px',
                  border: '1px solid rgba(42,58,158,0.3)',
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
                  fontSize: '8px',
                  fontWeight: '400',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--bronze)',
                  padding: '3px 8px',
                  border: '1px solid rgba(138,128,112,0.4)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Esgotado
              </span>
            )}
          </div>

          {/* Description */}
          {description && (
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '10px',
                letterSpacing: '0.07em',
                lineHeight: '1.65',
                color: 'var(--bronze)',
                margin: '0 0 16px 0',
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Price Display */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '19px',
              fontWeight: '400',
              color: 'var(--navy)',
            }}
          >
            {formattedPrice}
          </span>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
