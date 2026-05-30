import React from 'react'

export const DecoOrnament = ({ width = 140, opacity = 1 }) => {
  const cx = width / 2

  return (
    <svg width={width} height="14" viewBox={`0 0 ${width} 14`} style={{ opacity }}>
      {/* Left line: ends exactly 20px before center */}
      <line x1="0" y1="7" x2={cx - 20} y2="7" stroke="#C9A84C" strokeWidth="0.5"/>

      {/* Left Diamond: center cx - 12 */}
      <rect
        x={cx - 16}
        y="3"
        width="8"
        height="8"
        fill="#C9A84C"
        transform={`rotate(45 ${cx - 12} 7)`}
      />

      {/* Middle Diamond: center cx */}
      <rect
        x={cx - 2.5}
        y="4.5"
        width="5"
        height="5"
        fill="#C9A84C"
        transform={`rotate(45 ${cx} 7)`}
      />

      {/* Right Diamond: center cx + 12 */}
      <rect
        x={cx + 8}
        y="3"
        width="8"
        height="8"
        fill="#C9A84C"
        transform={`rotate(45 ${cx + 12} 7)`}
      />

      {/* Right line: starts exactly 20px after center */}
      <line
        x1={cx + 20}
        y1="7"
        x2={width}
        y2="7"
        stroke="#C9A84C"
        strokeWidth="0.5"
      />
    </svg>
  )
}

export default DecoOrnament
