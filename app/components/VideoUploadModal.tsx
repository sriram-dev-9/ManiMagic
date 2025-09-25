'use client'

import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from './ThemeProvider'
import { FaTimes, FaUpload, FaSpinner } from 'react-icons/fa'
import { createClient } from '@/lib/supabase/client'

interface VideoUploadModalProps {
  isOpen: boolean
  onClose: () => void
  videoBlob?: Blob
  videoUrl?: string
  title?: string
  code?: string
  onUploadSuccess?: () => void
}

export default function VideoUploadModal({
  isOpen,
  onClose,
  videoBlob,
  videoUrl,
  title: initialTitle = '',
  code: initialCode = '',
  onUploadSuccess
}: VideoUploadModalProps) {
  const { user } = useAuth()
  const { currentTheme } = useTheme()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [form, setForm] = useState({
    title: initialTitle,
    description: '',
    code: initialCode,
    tags: '',
    isPublic: true
  })

  const supabase = createClient()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || (!videoBlob && !videoUrl) || !form.title.trim()) return

    setUploading(true)
    setUploadProgress(0)

    try {
      let finalVideoUrl = videoUrl

      // If we have a blob, upload it to Supabase Storage
      if (videoBlob) {
        const fileName = `${user.id}/${Date.now()}.mp4`
        setUploadProgress(25)

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('videos')
          .upload(fileName, videoBlob, {
            contentType: 'video/mp4',
            upsert: false
          })

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`)
        }

        setUploadProgress(50)

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(uploadData.path)

        finalVideoUrl = publicUrl
      }

      setUploadProgress(75)

      // Ensure user profile exists before saving project
      const { error: profileEnsureError } = await supabase.rpc('ensure_user_profile', {
        user_uuid: user.id
      })

      if (profileEnsureError) {
        console.error('Error ensuring user profile:', profileEnsureError)
        // Continue anyway - try to save the project
      }

      // Create project record
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            user_id: user.id,
            title: form.title.trim(),
            description: form.description.trim() || null,
            code: form.code.trim(),
            video_url: finalVideoUrl,
            tags: form.tags ? form.tags.split(',').map(tag => tag.trim()).filter(Boolean) : null,
            is_public: form.isPublic
          }
        ])
        .select()
        .single()

      if (projectError) {
        throw new Error(`Failed to save project: ${projectError.message}`)
      }

      setUploadProgress(100)

      // Show success message briefly
      setTimeout(() => {
        onUploadSuccess?.()
        onClose()
        resetForm()
      }, 500)

    } catch (error) {
      console.error('Error uploading video:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      code: '',
      tags: '',
      isPublic: true
    })
  }

  const handleClose = () => {
    if (!uploading) {
      onClose()
      resetForm()
    }
  }

  if (!user) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: currentTheme.cardBg,
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          border: `1px solid ${currentTheme.border}`
        }}>
          <h3 style={{
            color: currentTheme.text,
            marginBottom: '16px',
            fontSize: '1.2rem'
          }}>
            Sign In Required
          </h3>
          <p style={{
            color: currentTheme.textSecondary,
            marginBottom: '24px'
          }}>
            You need to be signed in to upload videos to the community.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={handleClose}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: `1px solid ${currentTheme.border}`,
                color: currentTheme.text,
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => window.location.href = '/login'}
              style={{
                padding: '8px 16px',
                background: currentTheme.active,
                border: 'none',
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: currentTheme.cardBg,
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        border: `1px solid ${currentTheme.border}`,
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <h2 style={{
            color: currentTheme.text,
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: 0
          }}>
            Share Your Animation
          </h2>
          <button
            onClick={handleClose}
            disabled={uploading}
            style={{
              background: 'none',
              border: 'none',
              color: currentTheme.textSecondary,
              cursor: uploading ? 'not-allowed' : 'pointer',
              padding: '8px',
              borderRadius: '6px',
              opacity: uploading ? 0.5 : 1
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Video Preview */}
        {(videoBlob || videoUrl) && (
          <div style={{
            marginBottom: '24px',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: currentTheme.hoverBg
          }}>
            <video
              src={videoBlob ? URL.createObjectURL(videoBlob) : videoUrl}
              controls
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'contain'
              }}
            />
          </div>
        )}

        {/* Upload Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Title */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: currentTheme.text,
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Give your animation a catchy title"
              required
              disabled={uploading}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: currentTheme.inputBg,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                color: currentTheme.text,
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: currentTheme.text,
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your animation (optional)"
              rows={3}
              disabled={uploading}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: currentTheme.inputBg,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                color: currentTheme.text,
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Code */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: currentTheme.text,
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Manim Code
            </label>
            <textarea
              value={form.code}
              onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value }))}
              placeholder="Paste your Manim code here"
              rows={4}
              disabled={uploading}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: currentTheme.inputBg,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                color: currentTheme.text,
                fontSize: '14px',
                fontFamily: 'monospace',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Tags */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: currentTheme.text,
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Tags
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="Add tags separated by commas (e.g., animation, math, tutorial)"
              disabled={uploading}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: currentTheme.inputBg,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                color: currentTheme.text,
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Public/Private */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: currentTheme.text,
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={form.isPublic}
                onChange={(e) => setForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                disabled={uploading}
                style={{ marginRight: '4px' }}
              />
              Make this animation public (visible in community)
            </label>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div style={{
              background: currentTheme.hoverBg,
              borderRadius: '8px',
              padding: '16px',
              border: `1px solid ${currentTheme.border}`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}>
                <FaSpinner 
                  style={{ 
                    color: currentTheme.active,
                    animation: 'spin 1s linear infinite'
                  }} 
                />
                <span style={{ color: currentTheme.text, fontSize: '14px' }}>
                  Uploading... {uploadProgress}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: currentTheme.border,
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${uploadProgress}%`,
                  height: '100%',
                  background: currentTheme.active,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={uploading}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                border: `1px solid ${currentTheme.border}`,
                color: currentTheme.text,
                borderRadius: '8px',
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                opacity: uploading ? 0.5 : 1
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !form.title.trim()}
              style={{
                padding: '12px 24px',
                background: form.title.trim() && !uploading ? currentTheme.active : currentTheme.hoverBg,
                color: form.title.trim() && !uploading ? 'white' : currentTheme.textSecondary,
                border: 'none',
                borderRadius: '8px',
                cursor: form.title.trim() && !uploading ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {uploading ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaUpload />}
              {uploading ? 'Uploading...' : 'Share Animation'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}