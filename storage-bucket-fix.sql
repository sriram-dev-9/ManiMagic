-- Complete fix for storage bucket creation, missing columns, and user foreign key issues
-- Run this in your Supabase SQL editor if you're getting "Bucket not found" or foreign key constraint errors

-- First, ensure users table exists and is properly set up
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy for users table
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
    FOR ALL USING (auth.uid() = id);

-- Create or replace function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation (drop if exists first)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure all required columns exist in projects table
-- This is safe to run multiple times
DO $$ 
BEGIN
    -- Add video_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'video_url') THEN
        ALTER TABLE public.projects ADD COLUMN video_url text;
    END IF;
    
    -- Add thumbnail_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'thumbnail_url') THEN
        ALTER TABLE public.projects ADD COLUMN thumbnail_url text;
    END IF;
    
    -- Add likes_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'likes_count') THEN
        ALTER TABLE public.projects ADD COLUMN likes_count integer DEFAULT 0 NOT NULL;
    END IF;
    
    -- Add comments_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'comments_count') THEN
        ALTER TABLE public.projects ADD COLUMN comments_count integer DEFAULT 0 NOT NULL;
    END IF;
    
    -- Add views_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'views_count') THEN
        ALTER TABLE public.projects ADD COLUMN views_count integer DEFAULT 0 NOT NULL;
    END IF;
END $$;

-- Function to ensure user exists before creating project
CREATE OR REPLACE FUNCTION public.ensure_user_exists(user_uuid UUID)
RETURNS UUID AS $$
BEGIN
    -- Check if user exists in public.users
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = user_uuid) THEN
        -- If not, try to create from auth.users
        INSERT INTO public.users (id, email, full_name, avatar_url)
        SELECT 
            id, 
            email, 
            raw_user_meta_data->>'full_name',
            raw_user_meta_data->>'avatar_url'
        FROM auth.users 
        WHERE id = user_uuid
        ON CONFLICT (id) DO NOTHING;
    END IF;
    
    RETURN user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create manimagic-storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('manimagic-storage', 'manimagic-storage', true)
ON CONFLICT (id) DO NOTHING;

-- Create videos bucket as backup if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Add policies for videos bucket
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Videos bucket - user access select" ON storage.objects;
DROP POLICY IF EXISTS "Videos bucket - user access insert" ON storage.objects;
DROP POLICY IF EXISTS "Videos bucket - public access" ON storage.objects;
DROP POLICY IF EXISTS "Public videos are publicly accessible" ON storage.objects;

-- Create new policies
CREATE POLICY "Videos bucket - user access select" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Videos bucket - user access insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Videos bucket - public access" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

-- Add policies for manimagic-storage bucket videos folder
CREATE POLICY "Public videos are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'manimagic-storage' AND (storage.foldername(name))[2] = 'videos');