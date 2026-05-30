import React from 'react'
import HotelLogo from './HotelLogo'
import DecoOrnament from './DecoOrnament'

export function DecoHeader() {
  const hotelName = import.meta.env.VITE_HOTEL_NAME || 'Hotel São Luiz'
  const restaurantName = import.meta.env.VITE_RESTAURANT_NAME || 'Restaurante Don Fernando'

  return (
    <header
      style={{
        backgroundColor: 'var(--navy-dark)',
        borderBottom: '3px solid var(--gold)',
        padding: '28px 24px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {/* 2. HotelLogo size=52 with gold border, centered, mb 10px */}
      <div style={{ marginBottom: '10px' }}>
        <HotelLogo size={52} borderColor="var(--gold)" />
      </div>

      {/* 3. HOTEL SÃO LUIZ: font-ui, 9px, letter-spacing 0.4em, gold, uppercase */}
      <h2
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '9px',
          fontWeight: '400',
          letterSpacing: '0.4em',
          color: 'var(--gold)',
          textTransform: 'uppercase',
          margin: '0 0 12px 0',
          paddingLeft: '0.4em', // offset right padding to keep perfectly centered
        }}
      >
        {hotelName}
      </h2>

      {/* 4. DecoOrnament width=150, centered */}
      <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
        <DecoOrnament width={150} />
      </div>

      {/* 5. Restaurante Don Fernando: font-display, 26px, 300 italic, ivory */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '26px',
          fontWeight: '300',
          fontStyle: 'italic',
          color: 'var(--ivory)',
          margin: '0 0 8px 0',
        }}
      >
        {restaurantName}
      </h1>

      {/* 6. Gastronomia & Tradição: font-ui, 9px, letter-spacing 0.35em, gold, uppercase */}
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '9px',
          fontWeight: '400',
          letterSpacing: '0.35em',
          color: 'var(--gold)',
          textTransform: 'uppercase',
          margin: '0 0 16px 0',
          paddingLeft: '0.35em', // offset right padding to keep perfectly centered
        }}
      >
        Gastronomia & Tradição
      </p>

      {/* 7. Geometric strip: 5 divs [36px, 6px, 6px, 6px, 36px], height 2px, gold, gap 3px */}
      <div
        style={{
          display: 'flex',
          gap: '3px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '36px', height: '2px', backgroundColor: 'var(--gold)' }} />
        <div style={{ width: '6px', height: '2px', backgroundColor: 'var(--gold)' }} />
        <div style={{ width: '6px', height: '2px', backgroundColor: 'var(--gold)' }} />
        <div style={{ width: '6px', height: '2px', backgroundColor: 'var(--gold)' }} />
        <div style={{ width: '36px', height: '2px', backgroundColor: 'var(--gold)' }} />
      </div>
    </header>
  )
}

export default DecoHeader
