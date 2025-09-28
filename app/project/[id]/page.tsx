'use client'

import React, { useState, use  /* Comments loading functionality temporarily disabled */
  const loadComments = async () => {
    console.log('Comments loading functionality temporarily disabled')
    setComments([])
    /* Original implementation:
    try {
      const commentsData = await community.getComments(projectId)
      setComments(commentsData)
    } catch (error) {
      console.error('Error loading comments:', error)
    }
    */
  }m 'react'
import { useAuth } from '@/hooks/useAuth'
import { useParams } from 'next/navigation'
import { community, ProjectWithProfile, CommentWithProfile } from '@/lib/community'
import Navbar from '../../components/Navbar'
import { useTheme } from '../../components/ThemeProvider'
import { FaHeart, FaRegHeart, FaComment, FaPlay, FaUser, FaClock, FaCode } from 'react-icons/fa'
import Link from 'next/link'

export default function ProjectDetailPage() {
  const { user } = useAuth()
  const { currentTheme } = useTheme()
  const params = useParams()
  const projectId = params.id as string
  
  const [project, setProject] = useState<ProjectWithProfile | null>(null)
  const [comments, setComments] = useState<CommentWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [submittingLike, setSubmittingLike] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  useEffect(() => {
    if (projectId) {
      loadProject()
      loadComments()
      // Views recording removed
    }
  }, [projectId, user?.id])

  const loadProject = async () => {
    try {
      const projectData = await community.getProjectDetails(projectId, user?.id)
      setProject(projectData)
    } catch (error) {
      console.error('Error loading project:', error)
    } finally {
      setLoading(false)
    }
  }

  /* Comments loading functionality temporarily disabled */
  const loadComments = async () => {
    console.log('Comments loading functionality temporarily disabled')
    setComments([])
    /* Original implementation:
    try {
      const commentsData = await community.getComments(projectId)
      setComments(commentsData)
    } catch (error) */ {
      console.error('Error loading comments:', error)
    }
  }

  // recordView function removed

  const handleLike = async () => {
    if (!user || !project) {
      // If user is not logged in, redirect to login
      if (!user) {
        window.location.href = '/login';
        return;
      }
      return;
    }
    
    if (submittingLike) return; // Prevent double-clicks
    
    setSubmittingLike(true);
    
    // Optimistic update
    setProject(prev => prev ? {
      ...prev,
      user_liked: !prev.user_liked,
      likes_count: prev.user_liked 
        ? prev.likes_count - 1 
        : prev.likes_count + 1
    } : null)

    try {
      const { liked, error } = await community.toggleLike(projectId, user.id);
      
      if (error) {
        throw new Error(error);
      }
      
      // Just to ensure the UI reflects the actual state from the server
      setProject(prev => prev ? {
        ...prev,
        user_liked: liked,
        likes_count: liked 
          ? (prev.user_liked ? prev.likes_count : prev.likes_count + 1)
          : (prev.user_liked ? prev.likes_count - 1 : prev.likes_count)
      } : null);
      
    } catch (error) {
      // Revert on error
      setProject(prev => prev ? {
        ...prev,
        user_liked: !prev.user_liked,
        likes_count: prev.user_liked 
          ? prev.likes_count + 1 
          : prev.likes_count - 1
      } : null)
      console.error('Error toggling like:', error);
      alert('There was an error updating the like. Please try again.');
    } finally {
      setSubmittingLike(false);
    }
  }

  const handleComment = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault()
    if (!user) {
      window.location.href = '/login';
      return;
    }
    
    if (!commentText.trim()) return;

    setSubmittingComment(true)
    try {
      const newComment = await community.addComment(
        projectId,
        user.id,
        commentText.trim(),
        parentId
      )

      if (newComment) {
        // Reload comments to get updated structure
        await loadComments()
        setCommentText('')
        setReplyingTo(null)
        
        // Update comment count in project
        setProject(prev => prev ? {
          ...prev,
          comments_count: prev.comments_count + 1
        } : null)
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('There was an error posting your comment. Please try again.');
    } finally {
      setSubmittingComment(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div style={{
        paddingTop: "64px",
        background: currentTheme.background,
        minHeight: "100vh",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: `3px solid ${currentTheme.border}`,
          borderTop: `3px solid ${currentTheme.active}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    )
  }

  if (!project) {
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
          <h2>Project not found</h2>
          <Link href="/community" style={{ color: currentTheme.active }}>
            ← Back to Community
          </Link>
        </div>
      </div>
    )
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
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px 16px',
        color: currentTheme.text
      }}>
        {/* Back Link */}
        <Link href="/community" style={{
          display: 'inline-flex',
          alignItems: 'center',
          color: currentTheme.active,
          textDecoration: 'none',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          ← Back to Community
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* Main Content */}
          <div>
            {/* Video Player */}
            <div style={{
              background: currentTheme.cardBg,
              borderRadius: '12px',
              overflow: 'hidden',
              border: `1px solid ${currentTheme.border}`,
              marginBottom: '24px'
            }}>
              {project.video_url ? (
                <video
                  src={project.video_url}
                  controls
                  poster={project.thumbnail_url || undefined}
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'contain',
                    background: '#000'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: currentTheme.hoverBg,
                  color: currentTheme.textSecondary
                }}>
                  <FaPlay size={48} />
                </div>
              )}
            </div>

            {/* Project Info */}
            <div style={{
              background: currentTheme.cardBg,
              padding: '24px',
              borderRadius: '12px',
              border: `1px solid ${currentTheme.border}`,
              marginBottom: '24px'
            }}>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                margin: '0 0 16px 0',
                color: currentTheme.text
              }}>
                {project.title}
              </h1>

              {project.description && (
                <p style={{
                  fontSize: '1.1rem',
                  color: currentTheme.textSecondary,
                  lineHeight: '1.6',
                  margin: '0 0 20px 0'
                }}>
                  {project.description}
                </p>
              )}

              {/* Stats and Actions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  {/* Like Button - Temporarily commented out
                  <button
                    onClick={handleLike}
                    disabled={!user || submittingComment || submittingLike}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'none',
                      border: 'none',
                      cursor: user ? (submittingLike || submittingComment ? 'wait' : 'pointer') : 'not-allowed',
                      color: project.user_liked ? '#e53e3e' : currentTheme.textSecondary,
                      fontSize: '16px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      opacity: submittingLike ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (user && !submittingComment && !submittingLike) {
                        e.currentTarget.style.background = currentTheme.hoverBg
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none'
                    }}
                    title={user ? (project.user_liked ? "Unlike this project" : "Like this project") : "Sign in to like"}
                  >
                    {project.user_liked ? 
                      <FaHeart style={{ color: '#e53e3e', transform: 'scale(1.1)' }} /> : 
                      <FaRegHeart />
                    }
                    <span>{project.likes_count} {project.likes_count === 1 ? 'like' : 'likes'}</span>
                  </button>
                  */}

                  {/* Views removed */}

                  {/* Comments */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: currentTheme.textSecondary,
                    fontSize: '16px'
                  }}>
                    <FaComment />
                    {project.comments_count} {project.comments_count === 1 ? 'comment' : 'comments'}
                  </div>
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          background: currentTheme.hoverBg,
                          color: currentTheme.textSecondary,
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Code Section */}
            <div style={{
              background: currentTheme.cardBg,
              borderRadius: '12px',
              border: `1px solid ${currentTheme.border}`,
              overflow: 'hidden',
              marginBottom: '24px'
            }}>
              <button
                onClick={() => setShowCode(!showCode)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 24px',
                  background: 'none',
                  border: 'none',
                  color: currentTheme.text,
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = currentTheme.hoverBg}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaCode />
                  Manim Code
                </div>
                <span style={{ fontSize: '1.5rem' }}>
                  {showCode ? '−' : '+'}
                </span>
              </button>
              
              {showCode && (
                <div style={{
                  padding: '0 24px 24px',
                  borderTop: `1px solid ${currentTheme.border}`
                }}>
                  <pre style={{
                    background: currentTheme.hoverBg,
                    padding: '16px',
                    borderRadius: '8px',
                    overflow: 'auto',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    color: currentTheme.text,
                    margin: '16px 0 0 0',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {project.code}
                  </pre>
                </div>
              )}
            </div>

            {/* Comments Section - Temporarily commented out */}
            <div style={{
              background: currentTheme.cardBg,
              padding: '24px',
              borderRadius: '12px',
              border: `1px solid ${currentTheme.border}`,
              textAlign: 'center',
              color: currentTheme.textSecondary
            }}>
              Comments functionality temporarily disabled
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Author Info */}
            <div style={{
              background: currentTheme.cardBg,
              padding: '20px',
              borderRadius: '12px',
              border: `1px solid ${currentTheme.border}`,
              marginBottom: '20px'
            }}>
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                margin: '0 0 16px 0',
                color: currentTheme.text
              }}>
                Created by
              </h4>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: project.profiles.avatar_url 
                    ? `url(${project.profiles.avatar_url})` 
                    : currentTheme.active,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  {!project.profiles.avatar_url && (
                    project.profiles.full_name?.[0] || 
                    project.profiles.username?.[0] || 
                    '?'
                  )}
                </div>
                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: currentTheme.text
                  }}>
                    {project.profiles.full_name || project.profiles.username || 'Anonymous'}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: currentTheme.textSecondary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <FaClock size={12} />
                    {formatTimeAgo(project.created_at)}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Stats */}
            <div style={{
              background: currentTheme.cardBg,
              padding: '20px',
              borderRadius: '12px',
              border: `1px solid ${currentTheme.border}`
            }}>
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                margin: '0 0 16px 0',
                color: currentTheme.text
              }}>
                Stats
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: currentTheme.textSecondary }}>Likes</span>
                  <span style={{ color: currentTheme.text, fontWeight: '500' }}>
                    {project.likes_count}
                  </span>
                </div>
                {/* Views stats removed */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: currentTheme.textSecondary }}>Comments</span>
                  <span style={{ color: currentTheme.text, fontWeight: '500' }}>
                    {project.comments_count}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
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

// Comment Component
function CommentComponent({ 
  comment, 
  currentTheme, 
  formatTimeAgo, 
  user,
  onReply,
  replyingTo,
  onSubmitReply
}: {
  comment: CommentWithProfile
  currentTheme: any
  formatTimeAgo: (date: string) => string
  user: any
  onReply: (id: string) => void
  replyingTo: string | null
  onSubmitReply: (parentId: string, text: string) => void
}) {
  const [replyText, setReplyText] = useState('')

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (replyText.trim()) {
      onSubmitReply(comment.id, replyText.trim())
      setReplyText('')
      onReply('')
    }
  }

  return (
    <div style={{ marginLeft: comment.parent_id ? '32px' : '0' }}>
      <div style={{
        padding: '16px',
        background: currentTheme.hoverBg,
        borderRadius: '8px',
        border: `1px solid ${currentTheme.border}`
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: comment.profiles.avatar_url 
              ? `url(${comment.profiles.avatar_url})` 
              : currentTheme.active,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {!comment.profiles.avatar_url && (
              comment.profiles.full_name?.[0] || 
              comment.profiles.username?.[0] || 
              '?'
            )}
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: currentTheme.text
              }}>
                {comment.profiles.full_name || comment.profiles.username || 'Anonymous'}
              </span>
              <span style={{
                fontSize: '12px',
                color: currentTheme.textSecondary
              }}>
                {formatTimeAgo(comment.created_at)}
              </span>
            </div>
            
            <p style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              color: currentTheme.text,
              lineHeight: '1.4'
            }}>
              {comment.content}
            </p>
            
            {user && !comment.parent_id && (
              <button
                onClick={() => onReply(comment.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: currentTheme.active,
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                Reply
              </button>
            )}
          </div>
        </div>

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <form onSubmit={handleReplySubmit} style={{ marginTop: '12px', marginLeft: '44px' }}>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: currentTheme.inputBg,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '6px',
                color: currentTheme.text,
                fontSize: '13px',
                outline: 'none',
                resize: 'vertical',
                marginBottom: '8px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="submit"
                disabled={!replyText.trim()}
                style={{
                  padding: '6px 12px',
                  background: replyText.trim() ? currentTheme.active : currentTheme.hoverBg,
                  color: replyText.trim() ? 'white' : currentTheme.textSecondary,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                Reply
              </button>
              <button
                type="button"
                onClick={() => onReply('')}
                style={{
                  padding: '6px 12px',
                  background: 'none',
                  color: currentTheme.textSecondary,
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {comment.replies.map((reply) => (
            <CommentComponent
              key={reply.id}
              comment={reply}
              currentTheme={currentTheme}
              formatTimeAgo={formatTimeAgo}
              user={user}
              onReply={onReply}
              replyingTo={replyingTo}
              onSubmitReply={onSubmitReply}
            />
          ))}
        </div>
      )}
    </div>
  )
}