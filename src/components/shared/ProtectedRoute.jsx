import React, { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--navy-dark)',
          color: 'var(--gold)',
          fontFamily: 'var(--font-ui)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontSize: '11px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div 
            style={{
              width: '40px',
              height: '40px',
              border: '2px solid var(--gold-pale)',
              borderTop: '2px solid var(--gold)',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite',
            }}
          />
          Carregando Painel...
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  // If we have a user, render either passed children or route outlet
  return user ? (children ? children : <Outlet />) : null
}
export default ProtectedRoute
