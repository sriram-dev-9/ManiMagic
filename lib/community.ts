import { createClient } from './supabase/client'
import { Database } from './database.types'

type Tables = Database['public']['Tables']
type Like = Tables['likes']['Row']
type Comment = Tables['comments']['Row']
type ProjectView = Tables['project_views']['Row']
type Project = Tables['projects']['Row']

export interface ProjectWithProfile extends Project {
  profiles: {
    username: string | null
    full_name: string | null
    avatar_url: string | null
  }
  user_liked?: boolean
}

export interface CommentWithProfile extends Comment {
  profiles: {
    username: string | null
    full_name: string | null
    avatar_url: string | null
  }
  replies?: CommentWithProfile[]
}

export class CommunityManager {
  private supabase = createClient()

  // Get community projects with pagination
  async getCommunityProjects(
    page: number = 1,
    limit: number = 12,
    sortBy: 'latest' | 'popular' | 'trending' = 'latest',
    userId?: string
  ): Promise<{ projects: ProjectWithProfile[]; hasMore: boolean }> {
    const offset = (page - 1) * limit

    let query = this.supabase
      .from('projects')
      .select(`
        *,
        profiles (
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('is_public', true)
      .range(offset, offset + limit - 1)

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        query = query.order('likes_count', { ascending: false })
        break
      case 'trending':
        // Now trending just uses likes_count as well since views are removed
        query = query.order('likes_count', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    const { data: projects, error } = await query

    if (error) {
      console.error('Error fetching community projects:', error)
      return { projects: [], hasMore: false }
    }

    // Check if user has liked each project
    let projectsWithLikes = projects || []
    if (userId && projects) {
      const projectIds = projects.map(p => p.id)
      const { data: likes } = await this.supabase
        .from('likes')
        .select('project_id')
        .eq('user_id', userId)
        .in('project_id', projectIds)

      const likedProjectIds = new Set(likes?.map(l => l.project_id) || [])
      
      projectsWithLikes = projects.map(project => ({
        ...project,
        user_liked: likedProjectIds.has(project.id)
      }))
    }

    // Check if there are more projects
    const { count } = await this.supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('is_public', true)

    const hasMore = (count || 0) > offset + limit

    return { projects: projectsWithLikes, hasMore }
  }

  // Get single project with details
  async getProjectDetails(projectId: string, userId?: string): Promise<ProjectWithProfile | null> {
    const { data: project, error } = await this.supabase
      .from('projects')
      .select(`
        *,
        profiles (
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('id', projectId)
      .eq('is_public', true)
      .single()

    if (error || !project) {
      console.error('Error fetching project:', error)
      return null
    }

    // Check if user has liked this project
    let projectWithLike = project
    if (userId) {
      const { data: like } = await this.supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('project_id', projectId)
        .single()

      projectWithLike = {
        ...project,
        user_liked: !!like
      }
    }

    return projectWithLike
  }

  // Like/unlike a project
  async toggleLike(projectId: string, userId: string): Promise<{ liked: boolean; error?: string }> {
    try {
      // Check if already liked
      const { data: existingLike, error: checkError } = await this.supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('project_id', projectId)
        .single()
      
      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is the error code for "no rows returned"
        console.error('Error checking like status:', checkError)
        return { liked: false, error: checkError.message }
      }

      if (existingLike) {
        // Unlike
        const { error } = await this.supabase
          .from('likes')
          .delete()
          .eq('user_id', userId)
          .eq('project_id', projectId)

        if (error) {
          console.error('Error unliking project:', error)
          return { liked: true, error: error.message }
        }

        return { liked: false }
      } else {
        // Like
        const { error } = await this.supabase
          .from('likes')
          .insert([{ user_id: userId, project_id: projectId }])

        if (error) {
          console.error('Error liking project:', error)
          return { liked: false, error: error.message }
        }

        return { liked: true }
      }
    } catch (error) {
      console.error('Unexpected error in toggleLike:', error)
      return { liked: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Add a comment
  async addComment(
    projectId: string,
    userId: string,
    content: string,
    parentId?: string
  ): Promise<CommentWithProfile | null> {
    const { data: comment, error } = await this.supabase
      .from('comments')
      .insert([{
        user_id: userId,
        project_id: projectId,
        content,
        parent_id: parentId || null
      }])
      .select(`
        *,
        profiles (
          username,
          full_name,
          avatar_url
        )
      `)
      .single()

    if (error) {
      console.error('Error adding comment:', error)
      return null
    }

    return comment
  }

  // Get comments for a project
  async getComments(projectId: string): Promise<CommentWithProfile[]> {
    const { data: comments, error } = await this.supabase
      .from('comments')
      .select(`
        *,
        profiles (
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      return []
    }

    // Organize comments into threads (parent-child structure)
    const commentMap = new Map<string, CommentWithProfile>()
    const rootComments: CommentWithProfile[] = []

    // First pass: create map and identify root comments
    comments?.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] })
      if (!comment.parent_id) {
        rootComments.push(commentMap.get(comment.id)!)
      }
    })

    // Second pass: attach replies to parents
    comments?.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id)
        const child = commentMap.get(comment.id)
        if (parent && child) {
          parent.replies = parent.replies || []
          parent.replies.push(child)
        }
      }
    })

    return rootComments
  }

  // Record a view - REMOVED
  /* 
  async recordView(projectId: string, userId?: string, ipAddress?: string): Promise<void> {
    // Views functionality removed
  }
  */

  // Search projects
  async searchProjects(
    query: string,
    userId?: string
  ): Promise<ProjectWithProfile[]> {
    const { data: projects, error } = await this.supabase
      .from('projects')
      .select(`
        *,
        profiles (
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('is_public', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('likes_count', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error searching projects:', error)
      return []
    }

    // Check if user has liked each project
    let projectsWithLikes = projects || []
    if (userId && projects) {
      const projectIds = projects.map(p => p.id)
      const { data: likes } = await this.supabase
        .from('likes')
        .select('project_id')
        .eq('user_id', userId)
        .in('project_id', projectIds)

      const likedProjectIds = new Set(likes?.map(l => l.project_id) || [])
      
      projectsWithLikes = projects.map(project => ({
        ...project,
        user_liked: likedProjectIds.has(project.id)
      }))
    }

    return projectsWithLikes
  }

  // Get trending projects (most views in last 7 days)
  async getTrendingProjects(limit: number = 6): Promise<ProjectWithProfile[]> {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: projects, error } = await this.supabase
      .from('projects')
      .select(`
        *,
        profiles (
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('is_public', true)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('views_count', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching trending projects:', error)
      return []
    }

    return projects || []
  }
}

export const community = new CommunityManager()