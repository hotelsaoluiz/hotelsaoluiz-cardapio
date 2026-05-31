import React from 'react'

export const HotelLogo = ({ size = 52 }) => (
  <img 
    src="/logo.svg" 
    alt="Hotel São Luiz Logo" 
    width={size}
    height={size}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      objectFit: 'contain',
      display: 'block',
    }}
  />
)

export default HotelLogo
