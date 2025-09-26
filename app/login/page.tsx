'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signInWithProvider } = useAuth()
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
    } else {
      router.push('/play')
    }
    
    setLoading(false)
  }

  const handleProviderSignIn = async (provider: 'google' | 'github') => {
    setLoading(true)
    setError('')
    
    const { error } = await signInWithProvider(provider)
    
    if (error) {
      setError(error.message)
    }
    
    setLoading(false)
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #f9fafb, #e0e7ff)',
      padding: '3rem 1rem'
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        marginTop: '2rem',
        marginBottom: '2rem',
      }}>
        <div>
          <div style={{
            margin: '0 auto',
            height: '3rem',
            width: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#4f46e5'
            }}>MM</span>
          </div>
          <h2 style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '1.875rem',
            fontWeight: '800',
            color: '#111827'
          }}>
            Sign in to ManiMagic
          </h2>
          <p style={{
            marginTop: '0.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#4b5563'
          }}>
            Or{' '}
            <Link href="/signup" style={{
              fontWeight: '500',
              color: '#4f46e5',
              textDecoration: 'none'
            }}>
              create a new account
            </Link>
          </p>
        </div>
        
        <form style={{
            marginTop: '2rem'
          }} onSubmit={handleSignIn}>
          <div style={{
            borderRadius: '0.375rem',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}>
            <div>
              <label htmlFor="email-address" style={{ 
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: '0',
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                borderWidth: '0'
              }}>
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderWidth: '1px',
                  borderColor: '#d1d5db',
                  borderTopLeftRadius: '0.375rem',
                  borderTopRightRadius: '0.375rem',
                  borderBottomWidth: '0',
                  backgroundColor: '#ffffff',
                  color: '#111827',
                  fontSize: '0.875rem'
                }}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <label htmlFor="password" style={{ 
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: '0',
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                borderWidth: '0'
              }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  paddingRight: '2.5rem',
                  borderWidth: '1px',
                  borderColor: '#d1d5db',
                  borderBottomLeftRadius: '0.375rem',
                  borderBottomRightRadius: '0.375rem',
                  backgroundColor: '#ffffff',
                  color: '#111827',
                  fontSize: '0.875rem'
                }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                style={{
                  position: 'absolute',
                  top: '0',
                  bottom: '0',
                  right: '0',
                  paddingRight: '0.75rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash style={{ height: '1rem', width: '1rem', color: '#9ca3af' }} />
                ) : (
                  <FaEye style={{ height: '1rem', width: '1rem', color: '#9ca3af' }} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              color: '#dc2626',
              fontSize: '0.875rem',
              textAlign: 'center',
              marginTop: '0.75rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: '1.5rem' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#4f46e5',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? '0.5' : '1'
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                inset: '0',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '100%',
                  borderTopWidth: '1px',
                  borderColor: '#d1d5db'
                }} />
              </div>
              <div style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                fontSize: '0.875rem'
              }}>
                <span style={{
                  padding: '0 0.5rem',
                  backgroundColor: 'white',
                  color: '#6b7280'
                }}>Or continue with</span>
              </div>
            </div>

            <div style={{
              marginTop: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '0.75rem'
            }}>
              <button
                type="button"
                onClick={() => handleProviderSignIn('google')}
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  padding: '0.5rem 1rem',
                  borderWidth: '1px',
                  borderColor: '#d1d5db',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  backgroundColor: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? '0.5' : '1'
                }}
              >
                <FaGoogle style={{ height: '1.25rem', width: '1.25rem', color: '#ef4444' }} />
                <span style={{ marginLeft: '0.5rem' }}>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleProviderSignIn('github')}
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  padding: '0.5rem 1rem',
                  borderWidth: '1px',
                  borderColor: '#d1d5db',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  backgroundColor: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? '0.5' : '1'
                }}
              >
                <FaGithub style={{ height: '1.25rem', width: '1.25rem', color: '#111827' }} />
                <span style={{ marginLeft: '0.5rem' }}>GitHub</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}