import { createClient } from './supabase/client'

export class StorageManager {
  private supabase = createClient()
  private bucketName = 'manimagic-storage' // Fixed bucket name

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(file: File, path: string): Promise<{ data: any; error: any }> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${path}/${fileName}`

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    return { data, error }
  }

  /**
   * Get a public URL for a file
   */
  getPublicUrl(path: string): string {
    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path)

    return data.publicUrl
  }

  /**
   * Download a file
   */
  async downloadFile(path: string): Promise<{ data: Blob | null; error: any }> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .download(path)

    return { data, error }
  }

  /**
   * Delete a file
   */
  async deleteFile(path: string): Promise<{ data: any; error: any }> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .remove([path])

    return { data, error }
  }

  /**
   * List files in a directory
   */
  async listFiles(path: string = ''): Promise<{ data: any; error: any }> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .list(path, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })

    return { data, error }
  }

  /**
   * Upload animation video
   */
  async uploadAnimation(file: File, userId: string, projectId: string): Promise<{ data: any; error: any }> {
    const path = `animations/${userId}/${projectId}`
    return this.uploadFile(file, path)
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File, userId: string): Promise<{ data: any; error: any }> {
    const path = `avatars/${userId}`
    return this.uploadFile(file, path)
  }
}

export const storage = new StorageManager()