import React from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export function QRCodeDisplay() {
  const menuUrl = window.location.origin
  const hotelName = import.meta.env.VITE_HOTEL_NAME || 'Hotel São Luiz'

  const downloadQRCode = () => {
    const canvas = document.getElementById('menu-qr-code')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = `qrcode-cardapio-${hotelName.toLowerCase().replace(/\s+/g, '-')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: 'var(--white)',
        maxWidth: '320px',
        margin: '0 auto',
      }}
    >
      {/* Title */}
      <h3
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '11px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          color: 'var(--navy)',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        Acesse o Cardápio
      </h3>

      {/* QR Code Wrapper */}
      <div
        style={{
          border: '2px solid var(--navy)',
          padding: '20px',
          background: '#FFFFFF',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(20, 29, 85, 0.08)',
          marginBottom: '20px',
        }}
      >
        <QRCodeCanvas
          id="menu-qr-code"
          value={menuUrl}
          size={1024}
          style={{ width: '200px', height: '200px' }}
          bgColor="#FFFFFF"
          fgColor="#1E2A7A"
          level="H"
        />
      </div>

      {/* Download Button */}
      <button
        onClick={downloadQRCode}
        style={{
          border: 'var(--border-navy)',
          fontFamily: 'var(--font-ui)',
          fontSize: '10px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          borderRadius: '0px', // Strict radius 0 for public/shared elements
          color: 'var(--navy)',
          padding: '10px 20px',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          transition: 'all 200ms ease',
          width: '100%',
          textAlign: 'center',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(30,42,122,0.4)'
          e.currentTarget.style.backgroundColor = 'var(--navy-light)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(30,42,122,0.15)'
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        Baixar QR Code
      </button>

      <span
        style={{
          marginTop: '12px',
          fontFamily: 'var(--font-ui)',
          fontSize: '8px',
          letterSpacing: '0.08em',
          color: 'var(--bronze)',
          textAlign: 'center',
          wordBreak: 'break-all',
        }}
      >
        {menuUrl}
      </span>
    </div>
  )
}
export default QRCodeDisplay
