'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { community, ProjectWithProfile } from '@/lib/community'
import Navbar from '../components/Navbar'
import { useTheme } from '../components/ThemeProvider'
import { FaPlay, FaSearch, FaFilter, FaUser, FaTimes, FaPlus } from 'react-icons/fa'
import Link from 'next/link'

export default function CommunityPage() {
  const { user } = useAuth()
  const { currentTheme } = useTheme()
  const [projects, setProjects] = useState<ProjectWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest')
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    loadProjects(true)
  }, [sortBy])

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery !== '') {
        handleSearch()
      } else {
        loadProjects(true)
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchQuery])

  const loadProjects = async (reset = false) => {
    if (loading && !reset) return

    setLoading(true)
    try {
      const currentPage = reset ? 1 : page + 1
      const { projects: newProjects, hasMore: moreAvailable } = await community.getCommunityProjects(
        currentPage,
        12,
        sortBy,
        user?.id
      )

      if (reset) {
        setProjects(newProjects)
        setPage(1)
      } else {
        setProjects(prev => [...prev, ...newProjects])
        setPage(prev => prev + 1)
      }
      
      setHasMore(moreAvailable)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadProjects(true)
      return
    }

    setSearchLoading(true)
    try {
      const searchResults = await community.searchProjects(searchQuery, user?.id)
      setProjects(searchResults)
      setHasMore(false)
      setPage(0)
    } catch (error) {
      console.error('Error searching projects:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  // handleLike function - COMMENTED OUT
  /*
  const handleLike = async (projectId: string) => {
    if (!user) return

    // Optimistic update
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? {
            ...project,
            user_liked: !project.user_liked,
            likes_count: project.user_liked 
              ? project.likes_count - 1 
              : project.likes_count + 1
          }
        : project
    ))

    try {
      await community.toggleLike(projectId, user.id)
    } catch (error) {
      // Revert on error
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? {
              ...project,
              user_liked: !project.user_liked,
              likes_count: project.user_liked 
                ? project.likes_count + 1 
                : project.likes_count - 1
            }
          : project
      ))
      console.error('Error toggling like:', error)
    }
  }
  */

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
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: '0 0 16px 0',
            background: `linear-gradient(135deg, ${currentTheme.active}, ${currentTheme.text})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            Community Showcase
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: currentTheme.textSecondary,
            maxWidth: '600px',
            margin: '0 auto 24px'
          }}>
            Discover amazing animations created by the ManiMagic community. Share your own creations and get inspired!
          </p>
          
          {user && (
            <Link 
              href="/upload"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: currentTheme.active,
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = `0 4px 12px ${currentTheme.activeBorder}`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <FaPlus />
              Share Your Animation
            </Link>
          )}
        </div>

        {/* Search and Filter */}
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSearch() }} style={{ position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                <FaSearch style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: currentTheme.textSecondary,
                  fontSize: '14px'
                }} />
                <input
                  type="text"
                  placeholder="Search animations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    background: currentTheme.inputBg,
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px 0 0 8px',
                    color: currentTheme.text,
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = currentTheme.active}
                  onBlur={(e) => e.target.style.borderColor = currentTheme.border}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: currentTheme.textSecondary,
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    <FaTimes />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={searchLoading}
                  style={{
                    padding: '12px 16px',
                    background: currentTheme.active,
                    color: 'white',
                    border: 'none',
                    borderRadius: '0 8px 8px 0',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Search
                </button>
              </div>
            </form>

            {/* Sort Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <FaFilter style={{ color: currentTheme.textSecondary, fontSize: '14px' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  padding: '8px 12px',
                  background: currentTheme.inputBg,
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '6px',
                  color: currentTheme.text,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Liked</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: '24px' 
          }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                background: currentTheme.inputBg,
                borderRadius: '12px',
                overflow: 'hidden',
                border: `1px solid ${currentTheme.border}`,
                height: '400px'
              }}>
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: currentTheme.hoverBg,
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
              </div>
            ))}
          </div>
        ) : (
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
              gap: '24px',
              marginBottom: '32px'
            }}>
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onLike={() => {}} // handleLike commented out
                  currentTheme={currentTheme}
                  user={user}
                  formatTimeAgo={formatTimeAgo}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && !searchQuery && (
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => loadProjects()}
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    background: currentTheme.active,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}

            {projects.length === 0 && !loading && (
              <div style={{
                textAlign: 'center',
                padding: '64px 16px',
                color: currentTheme.textSecondary
              }}>
                <FaUser size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.5rem', margin: '0 0 8px 0' }}>
                  {searchQuery ? 'No results found' : 'No animations yet'}
                </h3>
                <p style={{ margin: '0 0 24px 0' }}>
                  {searchQuery 
                    ? 'Try adjusting your search terms' 
                    : 'Be the first to share an amazing animation!'}
                </p>
                {user && !searchQuery && (
                  <Link 
                    href="/upload"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: currentTheme.active,
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    <FaPlus />
                    Upload Your Animation
                  </Link>
                )}
              </div>
            )}
          </>
        )}
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

// Project Card Component
function ProjectCard({ 
  project, 
  onLike, 
  currentTheme, 
  user, 
  formatTimeAgo 
}: {
  project: ProjectWithProfile
  onLike: (id: string) => void
  currentTheme: any
  user: any
  formatTimeAgo: (date: string) => string
}) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <Link href={`/project/${project.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: currentTheme.cardBg,
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${currentTheme.border}`,
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 8px 25px ${currentTheme.border}`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      >
        {/* Video Thumbnail */}
        <div style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          background: currentTheme.hoverBg,
          overflow: 'hidden'
        }}>
          {project.video_url ? (
            <>
              <video
                src={project.video_url}
                poster={project.thumbnail_url || undefined}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                muted
                loop
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => {
                  e.currentTarget.pause()
                  e.currentTarget.currentTime = 0
                }}
              />
              {!isPlaying && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none'
                }}>
                  <FaPlay size={20} />
                </div>
              )}
            </>
          ) : (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: currentTheme.textSecondary
            }}>
              <FaPlay size={32} />
            </div>
          )}
          
          {/* View count overlay removed */}
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: currentTheme.text,
            lineHeight: '1.4'
          }}>
            {project.title}
          </h3>
          
          {project.description && (
            <p style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              color: currentTheme.textSecondary,
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {project.description}
            </p>
          )}

          {/* Author */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
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
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {!project.profiles.avatar_url && (
                project.profiles.full_name?.[0] || 
                project.profiles.username?.[0] || 
                '?'
              )}
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: currentTheme.text
              }}>
                {project.profiles.full_name || project.profiles.username || 'Anonymous'}
              </div>
              <div style={{
                fontSize: '12px',
                color: currentTheme.textSecondary
              }}>
                {formatTimeAgo(project.created_at)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Likes and comments temporarily disabled */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              color: currentTheme.textSecondary,
              fontSize: '12px',
              fontStyle: 'italic'
            }}>
              Interactions temporarily disabled
            </div>
            {/*
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              Like button 
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onLike(project.id)
                }}
                disabled={!user}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  cursor: user ? 'pointer' : 'not-allowed',
                  color: project.user_liked ? '#e53e3e' : currentTheme.textSecondary,
                  fontSize: '14px',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (user) {
                    e.currentTarget.style.background = currentTheme.hoverBg
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none'
                }}
              >
                {project.user_liked ? <FaHeart /> : <FaRegHeart />}
                {project.likes_count}
              </button>

              Comments 
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: currentTheme.textSecondary,
                fontSize: '14px'
              }}>
                <FaComment />
                {project.comments_count}
              </div>
            </div>
            */}

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {project.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      background: currentTheme.hoverBg,
                      color: currentTheme.textSecondary,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}