import React, { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Smartphone, Printer, Award, Loader2 } from 'lucide-react'

export function QRCodeDisplay() {
  const menuUrl = window.location.origin
  const hotelName = import.meta.env.VITE_HOTEL_NAME || 'Hotel São Luiz'
  const [isGenerating, setIsGenerating] = useState(null) // 'qr' | 'acrylic' | 'wall' | null

  // Utility to draw the gold diamond divider on the Canvas
  const drawDiamondDivider = (ctx, x, y, width) => {
    ctx.strokeStyle = '#C9A84C'
    ctx.lineWidth = 1.5
    
    // Left Horizontal Line
    ctx.beginPath()
    ctx.moveTo(x - width / 2, y)
    ctx.lineTo(x - 12, y)
    ctx.stroke()
    
    // Right Horizontal Line
    ctx.beginPath()
    ctx.moveTo(x + 12, y)
    ctx.lineTo(x + width / 2, y)
    ctx.stroke()
    
    // Center Gold Diamond
    ctx.fillStyle = '#C9A84C'
    ctx.beginPath()
    ctx.moveTo(x, y - 6)   // Top
    ctx.lineTo(x + 6, y)   // Right
    ctx.lineTo(x, y + 6)   // Bottom
    ctx.lineTo(x - 6, y)   // Left
    ctx.closePath()
    ctx.fill()
  }

  // Option 1: Download pure high-res QR Code PNG
  const downloadOnlyQRCode = () => {
    setIsGenerating('qr')
    try {
      const canvas = document.getElementById('menu-qr-code')
      if (!canvas) return
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = url
      link.download = `qrcode-cardapio-${hotelName.toLowerCase().replace(/\s+/g, '-')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error(err)
    } finally {
      setIsGenerating(null)
    }
  }

  // Option 2 & 3: Render and download stylized posters
  const generatePoster = async (type) => {
    setIsGenerating(type)
    // Add small delay to ensure loader renders and UI feels premium
    await new Promise((resolve) => setTimeout(resolve, 600))
    
    try {
      const width = type === 'acrylic' ? 800 : 1200
      const height = type === 'acrylic' ? 1200 : 1600
      
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      
      // 1. Draw Background
      ctx.fillStyle = '#141D55' // Rich deep navy blue
      ctx.fillRect(0, 0, width, height)
      
      // 2. Draw Borders
      ctx.strokeStyle = '#C9A84C' // Gold color
      ctx.lineWidth = type === 'acrylic' ? 4 : 6
      ctx.strokeRect(20, 20, width - 40, height - 40)
      
      ctx.strokeStyle = 'rgba(245, 243, 238, 0.15)' // Semi-transparent Ivory
      ctx.lineWidth = 1
      ctx.strokeRect(28, 28, width - 56, height - 56)
      
      // Corner ornaments for wall plaque
      if (type === 'wall') {
        ctx.fillStyle = '#C9A84C'
        const size = 30
        // Top Left
        ctx.fillRect(20, 20, size, 6)
        ctx.fillRect(20, 20, 6, size)
        // Top Right
        ctx.fillRect(width - 20 - size, 20, size, 6)
        ctx.fillRect(width - 26, 20, 6, size)
        // Bottom Left
        ctx.fillRect(20, height - 26, size, 6)
        ctx.fillRect(20, height - 20 - size, 6, size)
        // Bottom Right
        ctx.fillRect(width - 20 - size, height - 26, size, 6)
        ctx.fillRect(width - 26, height - 20 - size, 6, size)
      }
      
      // 3. Load and Draw Logo
      const logoImg = new Image()
      logoImg.src = '/logo.svg'
      
      await new Promise((resolve) => {
        logoImg.onload = resolve
        logoImg.onerror = resolve // proceed even if logo fails
      })
      
      const logoSize = type === 'acrylic' ? 140 : 200
      const logoX = (width - logoSize) / 2
      const logoY = type === 'acrylic' ? 70 : 100
      
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)
      } else {
        // Fallback: draw elegant placeholder text if logo doesn't exist
        ctx.fillStyle = '#C9A84C'
        ctx.font = `italic bold ${type === 'acrylic' ? '28px' : '36px'} Georgia, serif`
        ctx.textAlign = 'center'
        ctx.fillText(hotelName, width / 2, logoY + 60)
      }
      
      // 4. Draw Titles & Text
      ctx.fillStyle = '#F5F3EE' // Ivory text
      ctx.textAlign = 'center'
      
      if (type === 'acrylic') {
        // ACRYLIC poster text (Mesa)
        ctx.font = 'italic 18px Georgia, serif'
        ctx.fillStyle = '#C9A84C' // Gold subtitle
        ctx.fillText('Restaurante Don Fernando', width / 2, 260)
        
        ctx.font = 'bold 28px "Inter", "Arial", sans-serif'
        ctx.fillStyle = '#F5F3EE' // Ivory
        ctx.fillText('CARDÁPIO DIGITAL', width / 2, 305)
        
        // Draw gold diamond divider
        drawDiamondDivider(ctx, width / 2, 335, 120)
        
        // Instruction text
        ctx.font = 'bold 12px "Inter", "Arial", sans-serif'
        ctx.fillStyle = '#C9A84C'
        ctx.fillText('APONTE A CÂMERA DO CELULAR', width / 2, 385)
        
        ctx.font = 'italic 13px Georgia, serif'
        ctx.fillStyle = '#F5F3EE'
        ctx.fillText('para escanear o QR Code abaixo', width / 2, 410)
      } else {
        // WALL PLAQUE text (Parede)
        ctx.font = 'italic 22px Georgia, serif'
        ctx.fillStyle = '#F5F3EE'
        ctx.fillText('Seja Bem-vindo ao', width / 2, 340)
        
        ctx.font = 'bold 42px Georgia, serif'
        ctx.fillStyle = '#C9A84C' // Large Gold Hotel Name
        ctx.fillText(hotelName.toUpperCase(), width / 2, 395)
        
        ctx.font = 'italic 24px Georgia, serif'
        ctx.fillStyle = '#F5F3EE'
        ctx.fillText('Restaurante Don Fernando', width / 2, 440)
        
        // Draw gold diamond divider
        drawDiamondDivider(ctx, width / 2, 475, 180)
        
        // Instruction text
        ctx.font = 'bold 15px "Inter", sans-serif'
        ctx.fillStyle = '#C9A84C'
        ctx.fillText('ESCANEIE O QR CODE ABAIXO', width / 2, 530)
        
        ctx.font = '14px "Inter", sans-serif'
        ctx.fillStyle = '#F5F3EE'
        ctx.fillText('Para visualizar o nosso cardápio digital completo', width / 2, 560)
      }
      
      // 5. Draw QR Code
      const qrCanvas = document.getElementById('menu-qr-code')
      if (qrCanvas) {
        const qrSize = type === 'acrylic' ? 320 : 440
        const qrX = (width - qrSize) / 2
        const qrY = type === 'acrylic' ? 470 : 640
        
        // Draw white background card for QR Code
        ctx.fillStyle = '#FFFFFF'
        const padding = type === 'acrylic' ? 24 : 32
        ctx.fillRect(qrX - padding, qrY - padding, qrSize + padding * 2, qrSize + padding * 2)
        
        // Draw fine gold line around white card
        ctx.strokeStyle = '#C9A84C'
        ctx.lineWidth = 2
        ctx.strokeRect(qrX - padding, qrY - padding, qrSize + padding * 2, qrSize + padding * 2)
        
        // Draw QR Code onto canvas
        ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize)
      }
      
      // 6. Draw Footer Callout
      ctx.fillStyle = '#C9A84C'
      ctx.font = 'bold 11px "Inter", sans-serif'
      ctx.letterSpacing = '2px'
      ctx.fillText('ACESSO RÁPIDO • SEM APLICATIVOS', width / 2, type === 'acrylic' ? 950 : 1230)
      
      ctx.fillStyle = 'rgba(245, 243, 238, 0.4)'
      ctx.font = '9px "Inter", sans-serif'
      ctx.fillText(menuUrl.toUpperCase(), width / 2, type === 'acrylic' ? 985 : 1265)
      
      // 7. Download Action
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = url
      link.download = `arte-cardapio-${type === 'acrylic' ? 'acrilico-mesa' : 'placa-parede'}-${hotelName.toLowerCase().replace(/\s+/g, '-')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error(err)
      alert('Erro ao gerar a arte: ' + err.message)
    } finally {
      setIsGenerating(null)
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      
      {/* 1. Live QR Code Preview Panel */}
      <div className="bg-navy-dark border border-gold rounded-admin p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="text-left max-w-md">
          <span className="text-[10px] text-gold uppercase tracking-widest font-bold block mb-1">
            Link Detectado em Tempo Real
          </span>
          <h3 className="text-base font-bold text-white font-display text-ivory mb-2">
            Acesso Direto ao Cardápio
          </h3>
          <p className="text-xs text-slate-350 leading-relaxed mb-4">
            Este QR Code aponta automaticamente para a URL ativa de acesso dos clientes. 
            Você não precisa alterar nada ao mudar o domínio ou testar localmente.
          </p>
          <div className="bg-slate-900/40 border border-slate-800 px-3 py-2 rounded text-[11px] font-mono text-gold-light select-all break-all">
            {menuUrl}
          </div>
        </div>

        {/* Live Canvas (Hidden container but active for rendering) */}
        <div className="bg-white p-4 border border-gold shadow-lg flex-shrink-0 flex items-center justify-center">
          <QRCodeCanvas
            id="menu-qr-code"
            value={menuUrl}
            size={1024}
            style={{ width: '160px', height: '160px' }}
            bgColor="#FFFFFF"
            fgColor="#1E2A7A"
            level="H"
          />
        </div>
      </div>

      {/* 2. Download Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD 1: Pure QR Code */}
        <div className="bg-white border border-slate-200 rounded-admin p-5 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-navy/10 text-navy flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Apenas o QR Code (PNG)</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Download da imagem pura do QR Code com fundo branco em altíssima definição (1024px). 
                Ideal para incorporar em cardápios impressos existentes ou enviar para o seu designer.
              </p>
            </div>
          </div>
          <button
            onClick={downloadOnlyQRCode}
            disabled={isGenerating !== null}
            className="mt-5 w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            {isGenerating === 'qr' ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Baixar QR Code
          </button>
        </div>

        {/* CARD 2: Acrylic Table Stand */}
        <div className="bg-white border border-slate-200 rounded-admin p-5 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-navy/10 text-navy flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Display de Mesa (10x15cm)</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Gera um folheto vertical elegante com bordas douradas e o logotipo do hotel. 
                Perfeito para colocar em suportes acrílicos de mesa ou cômodas dos quartos.
              </p>
            </div>
          </div>
          <button
            onClick={() => generatePoster('acrylic')}
            disabled={isGenerating !== null}
            className="mt-5 w-full flex items-center justify-center gap-2 py-2 px-4 bg-navy hover:bg-navy-mid text-white disabled:opacity-50 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            {isGenerating === 'acrylic' ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Baixar Arte de Mesa
          </button>
        </div>

        {/* CARD 3: Wall Plaque */}
        <div className="bg-white border border-slate-200 rounded-admin p-5 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-navy/10 text-navy flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Placa Decorativa de Parede</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Gera um banner decorativo nobre em formato A4/A3 com ornamentos coloniais dourados. 
                Ideal para enquadrar e colocar na parede da entrada do restaurante ou na recepção.
              </p>
            </div>
          </div>
          <button
            onClick={() => generatePoster('wall')}
            disabled={isGenerating !== null}
            className="mt-5 w-full flex items-center justify-center gap-2 py-2 px-4 bg-navy hover:bg-navy-mid text-white disabled:opacity-50 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            {isGenerating === 'wall' ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Baixar Arte de Parede
          </button>
        </div>

      </div>
    </div>
  )
}

export default QRCodeDisplay
