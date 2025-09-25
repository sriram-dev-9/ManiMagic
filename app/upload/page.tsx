'use client'

import React, { useState, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/storage'
import { db } from '@/lib/database'
import Navbar from '../components/Navbar'
import { useTheme } from '../components/ThemeProvider'
import { FaUpload, FaPlay, FaTimes, FaSpinner } from 'react-icons/fa'

export default function UploadPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { currentTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    tags: '',
    isPublic: true
  })
  
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      router.push('/login?redirectTo=/upload')
    }
  }, [user, router])

  if (!user) {
    return (
      <div style={{
        paddingTop: "64px",
        background: currentTheme.background,
        minHeight: "100vh",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: currentTheme.text }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: `3px solid ${currentTheme.border}`,
            borderTop: `3px solid ${currentTheme.active}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file')
      return
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setError('Video file must be less than 50MB')
      return
    }

    setVideoFile(file)
    setError('')

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setVideoPreview(previewUrl)
  }

  const removeVideo = () => {
    setVideoFile(null)
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
      setVideoPreview(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!videoFile) {
      setError('Please select a video file')
      return
    }

    if (!formData.title.trim()) {
      setError('Please enter a title')
      return
    }

    if (!formData.code.trim()) {
      setError('Please enter the Manim code')
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setError('')

    try {
      // Upload video
      setUploadProgress(25)
      const { data: videoUpload, error: videoError } = await storage.uploadAnimation(
        videoFile,
        user.id,
        Date.now().toString()
      )

      if (videoError) {
        throw new Error('Failed to upload video: ' + videoError.message)
      }

      setUploadProgress(50)

      // Get public URL for the video
      const videoUrl = storage.getPublicUrl(videoUpload.path)

      setUploadProgress(75)

      // Create project in database
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        code: formData.code.trim(),
        user_id: user.id,
        is_public: formData.isPublic,
        tags: formData.tags.trim() ? formData.tags.split(',').map(tag => tag.trim()) : [],
        video_url: videoUrl
      }

      const project = await db.createProject(projectData)

      if (!project) {
        throw new Error('Failed to save project')
      }

      setUploadProgress(100)

      // Success - redirect to community
      setTimeout(() => {
        router.push('/community')
      }, 1000)

    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div style={{
      paddingTop: "64px",
      background: currentTheme.background,
      minHeight: "100vh",
      transition: 'background 0.3s ease'
    }}>
      <Navbar />
      
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '32px 16px',
        color: currentTheme.text
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Share Your Animation
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: currentTheme.textSecondary,
            margin: 0
          }}>
            Upload your Manim creation and share it with the community
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Video Upload */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '8px',
              color: currentTheme.text
            }}>
              Animation Video *
            </label>
            
            {!videoFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${currentTheme.border}`,
                  borderRadius: '12px',
                  padding: '48px 24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: currentTheme.hoverBg,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = currentTheme.active
                  e.currentTarget.style.background = currentTheme.activeBg
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = currentTheme.border
                  e.currentTarget.style.background = currentTheme.hoverBg
                }}
              >
                <FaUpload style={{ fontSize: '48px', color: currentTheme.active, marginBottom: '16px' }} />
                <p style={{ fontSize: '1.1rem', margin: '0 0 8px 0', color: currentTheme.text }}>
                  Click to upload your animation
                </p>
                <p style={{ fontSize: '0.9rem', color: currentTheme.textSecondary, margin: 0 }}>
                  MP4, MOV, AVI up to 50MB
                </p>
              </div>
            ) : (
              <div style={{
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '12px',
                overflow: 'hidden',
                background: currentTheme.cardBg
              }}>
                <div style={{ position: 'relative' }}>
                  <video
                    src={videoPreview!}
                    controls
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'contain',
                      background: '#000'
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeVideo}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
                <div style={{ padding: '12px' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: currentTheme.textSecondary }}>
                    {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                  </p>
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>

          {/* Title */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '8px',
              color: currentTheme.text
            }}>
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter a catchy title for your animation"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: currentTheme.inputBg,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                color: currentTheme.text,
                fontSize: '16px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = currentTheme.active}
              onBlur={(e) => e.target.style.borderColor = currentTheme.border}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '8px',
              color: currentTheme.text
            }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your animation (optional)"
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: currentTheme.inputBg,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                color: currentTheme.text,
                fontSize: '16px',
                outline: 'none',
                resize: 'vertical'
              }}
              onFocus={(e) => e.target.style.borderColor = currentTheme.active}
              onBlur={(e) => e.target.style.borderColor = currentTheme.border}
            />
          </div>

          {/* Manim Code */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '8px',
              color: currentTheme.text
            }}>
              Manim Code *
            </label>
            <textarea
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              placeholder="Paste your Manim Python code here..."
              rows={8}
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
              onFocus={(e) => e.target.style.borderColor = currentTheme.active}
              onBlur={(e) => e.target.style.borderColor = currentTheme.border}
            />
          </div>

          {/* Tags */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '8px',
              color: currentTheme.text
            }}>
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="animation, mathematics, geometry (comma separated)"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: currentTheme.inputBg,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                color: currentTheme.text,
                fontSize: '16px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = currentTheme.active}
              onBlur={(e) => e.target.style.borderColor = currentTheme.border}
            />
          </div>

          {/* Visibility */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                style={{ accentColor: currentTheme.active }}
              />
              <span style={{ fontSize: '1rem', color: currentTheme.text }}>
                Make this animation public (visible in community)
              </span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div style={{
              padding: '16px',
              background: currentTheme.cardBg,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}>
                <FaSpinner style={{ animation: 'spin 1s linear infinite', color: currentTheme.active }} />
                <span style={{ color: currentTheme.text }}>Uploading... {uploadProgress}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '4px',
                background: currentTheme.border,
                borderRadius: '2px',
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || !videoFile || !formData.title.trim() || !formData.code.trim()}
            style={{
              padding: '16px 32px',
              background: uploading ? currentTheme.hoverBg : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: uploading ? currentTheme.textSecondary : 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: uploading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!uploading) {
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {uploading ? 'Uploading...' : 'Share Animation'}
          </button>
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