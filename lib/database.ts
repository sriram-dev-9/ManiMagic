import { createClient } from './supabase/client'
import { Database } from './database.types'

type Tables = Database['public']['Tables']
type Profile = Tables['profiles']['Row']
type Project = Tables['projects']['Row']
type ProjectInsert = Tables['projects']['Insert']
type ProjectUpdate = Tables['projects']['Update']

export class DatabaseManager {
  private supabase = createClient()

  // Profile management
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  }

  async createProfile(userId: string, profile: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert([{ id: userId, ...profile }])
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      return null
    }

    return data
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return null
    }

    return data
  }

  // Project management
  async getProjects(userId: string, includePublic: boolean = false): Promise<Project[]> {
    let query = this.supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false })

    if (includePublic) {
      query = query.or(`user_id.eq.${userId},is_public.eq.true`)
    } else {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching projects:', error)
      return []
    }

    return data || []
  }

  async getProject(projectId: string, userId?: string): Promise<Project | null> {
    let query = this.supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)

    // If userId is provided, check if user owns the project or if it's public
    if (userId) {
      query = query.or(`user_id.eq.${userId},is_public.eq.true`)
    } else {
      query = query.eq('is_public', true)
    }

    const { data, error } = await query.single()

    if (error) {
      console.error('Error fetching project:', error)
      return null
    }

    return data
  }

  async createProject(project: ProjectInsert): Promise<Project | null> {
    const { data, error } = await this.supabase
      .from('projects')
      .insert([project])
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return null
    }

    return data
  }

  async updateProject(projectId: string, updates: ProjectUpdate, userId: string): Promise<Project | null> {
    const { data, error } = await this.supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .eq('user_id', userId) // Ensure user owns the project
      .select()
      .single()

    if (error) {
      console.error('Error updating project:', error)
      return null
    }

    return data
  }

  async deleteProject(projectId: string, userId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId) // Ensure user owns the project

    if (error) {
      console.error('Error deleting project:', error)
      return false
    }

    return true
  }

  async getPublicProjects(limit: number = 20): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .eq('is_public', true)
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching public projects:', error)
      return []
    }

    return data || []
  }

  async searchProjects(searchTerm: string, userId?: string): Promise<Project[]> {
    let query = this.supabase
      .from('projects')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('updated_at', { ascending: false })

    if (userId) {
      query = query.or(`user_id.eq.${userId},is_public.eq.true`)
    } else {
      query = query.eq('is_public', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error searching projects:', error)
      return []
    }

    return data || []
  }
}

export const db = new DatabaseManager()