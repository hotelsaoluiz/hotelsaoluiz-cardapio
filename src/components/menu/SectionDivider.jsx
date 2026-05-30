import React from 'react'

export const SectionDivider = ({ title }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      margin: '24px 0 18px',
    }}
  >
    <span
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 18,
        fontStyle: 'italic',
        fontWeight: 400,
        color: 'var(--navy)',
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}
    >
      {title}
    </span>

    <div
      style={{
        flex: 1,
        height: 1,
        background: 'linear-gradient(to right, var(--gold), transparent)',
      }}
    />
  </div>
)

export default SectionDivider
