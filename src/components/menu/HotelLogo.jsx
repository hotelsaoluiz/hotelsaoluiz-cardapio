import React from 'react'

export const HotelLogo = ({ size = 52, borderColor = '#C9A84C' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52">
    <circle cx="26" cy="26" r="24" fill="#1E2A7A" stroke={borderColor} strokeWidth="1.5"/>
    <text
      x="26"
      y="21"
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily="'Cormorant Garamond', serif"
      fontSize="13"
      fontWeight="600"
      fill="white"
      letterSpacing="1"
    >
      S
    </text>
    <line x1="14" y1="26" x2="38" y2="26" stroke="white" strokeWidth="0.8"/>
    <text
      x="26"
      y="33"
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily="'Cormorant Garamond', serif"
      fontSize="13"
      fontWeight="600"
      fill="white"
      letterSpacing="1"
    >
      L
    </text>
  </svg>
)

export default HotelLogo
