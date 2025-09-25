'use client'

import React, { useState, useEffect } from 'react'
import { FaCheck, FaTimes, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa'
import { useTheme } from './ThemeProvider'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onClose?: () => void
}

export default function Toast({ message, type = 'info', duration = 4000, onClose }: ToastProps) {
  const { currentTheme } = useTheme()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose?.(), 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success': return <FaCheck />
      case 'error': return <FaTimes />
      case 'warning': return <FaExclamationTriangle />
      default: return <FaInfoCircle />
    }
  }

  const getColors = () => {
    switch (type) {
      case 'success': 
        return { 
          bg: '#10b981', 
          border: '#059669',
          text: '#ffffff'
        }
      case 'error': 
        return { 
          bg: '#ef4444', 
          border: '#dc2626',
          text: '#ffffff'
        }
      case 'warning': 
        return { 
          bg: '#f59e0b', 
          border: '#d97706',
          text: '#ffffff'
        }
      default: 
        return { 
          bg: currentTheme.active, 
          border: currentTheme.activeBorder,
          text: '#ffffff'
        }
    }
  }

  const colors = getColors()

  if (!isVisible) return null

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      background: colors.bg,
      color: colors.text,
      padding: '12px 16px',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      zIndex: 1000,
      minWidth: '300px',
      maxWidth: '500px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      transition: 'all 0.3s ease-in-out',
      fontSize: '14px',
      fontWeight: '500'
    }}>
      <div style={{ flexShrink: 0 }}>
        {getIcon()}
      </div>
      <div style={{ flex: 1 }}>
        {message}
      </div>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(() => onClose?.(), 300)
        }}
        style={{
          background: 'none',
          border: 'none',
          color: colors.text,
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          opacity: 0.8,
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
      >
        <FaTimes size={12} />
      </button>
    </div>
  )
}

// Toast Manager Component
interface ToastManagerProps {
  toasts: Array<{
    id: string
    message: string
    type?: 'success' | 'error' | 'info' | 'warning'
    duration?: number
  }>
  onRemoveToast: (id: string) => void
}

export function ToastManager({ toasts, onRemoveToast }: ToastManagerProps) {
  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            transform: `translateY(${index * 4}px)`,
            transition: 'transform 0.3s ease'
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => onRemoveToast(toast.id)}
          />
        </div>
      ))}
    </div>
  )
}