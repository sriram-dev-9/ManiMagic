# Supabase Integration Guide for ManiMagic

This document provides a comprehensive guide for the Supabase integration in ManiMagic, including authentication, database operations, and storage management.

## Overview

ManiMagic uses Supabase as its backend-as-a-service provider, offering:
- **Authentication**: Email/password and OAuth (Google, GitHub)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Storage**: File storage for animations, avatars, and user assets
- **Real-time**: Live updates for collaborative features (future)

## Architecture

### Authentication Flow
1. Users can sign up/in with email/password or OAuth providers
2. Supabase handles session management and JWT tokens
3. Client-side auth state is managed through React Context
4. Server-side auth verification via middleware
5. Protected routes require authentication

### Database Schema

#### Tables

**profiles**
- `id` (uuid, primary key) - References auth.users.id
- `username` (text, unique) - User's display name
- `full_name` (text) - User's full name
- `avatar_url` (text) - URL to user's avatar image
- `website` (text) - User's website
- `created_at` (timestamp) - Account creation date
- `updated_at` (timestamp) - Last profile update

**projects**
- `id` (uuid, primary key) - Unique project identifier
- `title` (text, required) - Project title
- `description` (text) - Project description
- `code` (text, required) - Manim Python code
- `user_id` (uuid, foreign key) - References profiles.id
- `created_at` (timestamp) - Project creation date
- `updated_at` (timestamp) - Last modification date
- `is_public` (boolean) - Whether project is publicly visible
- `tags` (text[]) - Array of project tags

### Row Level Security (RLS) Policies

**profiles table:**
- Public profiles are viewable by everyone
- Users can insert their own profile
- Users can update their own profile

**projects table:**
- Public projects are viewable by everyone
- Users can view their own projects
- Users can insert their own projects
- Users can update their own projects
- Users can delete their own projects

### Storage Buckets

**manimagic-storage**
- User-specific folders with path structure: `{user_id}/{type}/{filename}`
- Types: `avatars`, `animations`, `svg-uploads`
- Public access for avatars and public animations
- Private access for user's own files

## API Usage Examples

### Authentication

```typescript
import { useAuth } from '@/hooks/useAuth'

// In a component
const { user, signIn, signUp, signOut, loading } = useAuth()

// Sign up
const handleSignUp = async () => {
  const { data, error } = await signUp(email, password, {
    full_name: fullName
  })
}

// Sign in
const handleSignIn = async () => {
  const { data, error } = await signIn(email, password)
}

// OAuth sign in
const handleOAuthSignIn = async () => {
  const { data, error } = await signInWithProvider('google')
}

// Sign out
const handleSignOut = async () => {
  const { error } = await signOut()
}
```

### Database Operations

```typescript
import { db } from '@/lib/database'

// Create a project
const project = await db.createProject({
  title: 'My Animation',
  description: 'A cool animation',
  code: 'from manim import *...',
  user_id: user.id,
  is_public: false
})

// Get user's projects
const projects = await db.getProjects(user.id)

// Get public projects
const publicProjects = await db.getPublicProjects(20)

// Update a project
const updatedProject = await db.updateProject(projectId, {
  title: 'Updated Title',
  code: 'updated code...'
}, user.id)

// Delete a project
const success = await db.deleteProject(projectId, user.id)
```

### Storage Operations

```typescript
import { storage } from '@/lib/storage'

// Upload an animation
const { data, error } = await storage.uploadAnimation(
  file, 
  user.id, 
  projectId
)

// Upload user avatar
const { data, error } = await storage.uploadAvatar(file, user.id)

// Get public URL
const url = storage.getPublicUrl('path/to/file')

// Download a file
const { data, error } = await storage.downloadFile('path/to/file')

// Delete a file
const { data, error } = await storage.deleteFile('path/to/file')
```

## Environment Variables

Required environment variables in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

That's it! Just 2 environment variables needed.

## Security Considerations

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data unless explicitly shared
- Public projects are accessible to all users
- Admin operations require service role key

### Authentication
- JWT tokens are httpOnly cookies when possible
- Session refresh handled automatically
- OAuth providers require proper configuration
- Email confirmation required for new accounts

### Storage
- File uploads are validated for size and type
- User-specific paths prevent unauthorized access
- Public URLs for shared content only
- Automatic cleanup of orphaned files (future)

## Migration Guide

If you're adding Supabase to an existing ManiMagic installation:

1. **Install dependencies**:
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```

2. **Set up environment variables**:
   Copy values from your Supabase project dashboard

3. **Run database migrations**:
   Execute `supabase-setup.sql` in your Supabase SQL editor

4. **Update your code**:
   - Wrap your app with `AuthProvider`
   - Use `useAuth()` hook in components
   - Update API routes to use authenticated requests

5. **Test the integration**:
   - Verify sign up/in flows work
   - Test project creation and retrieval
   - Confirm file uploads work

## Troubleshooting

### Common Issues

**Authentication not working**
- Check environment variables are set correctly
- Verify Supabase project URL and keys
- Ensure RLS policies are set up correctly

**Database queries failing**
- Check RLS policies allow the operation
- Verify user is authenticated for protected operations
- Check database schema matches TypeScript types

**File uploads not working**
- Verify storage bucket exists and is configured
- Check storage policies allow the operation
- Ensure file size is within limits

**OAuth providers not working**
- Configure OAuth apps in provider dashboards
- Add correct redirect URLs
- Enable providers in Supabase Auth settings

### Debug Mode

Enable debug logging by setting:
```env
NEXT_PUBLIC_SUPABASE_DEBUG=true
```

This will log all Supabase operations to the browser console.

## Future Enhancements

- Real-time collaboration on projects
- Project sharing and permissions
- Comment system for public projects
- Analytics and usage tracking
- Advanced search and filtering
- Project templates and marketplace
- Integration with external tools

## Support

For issues specific to Supabase integration:
1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review RLS policies in your dashboard
3. Check browser network tab for API errors
4. Enable debug mode for detailed logging

For ManiMagic-specific issues:
1. Open an issue on the GitHub repository
2. Include relevant error messages and logs
3. Provide steps to reproduce the issue