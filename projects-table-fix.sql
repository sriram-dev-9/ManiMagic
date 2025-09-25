-- Simple fix for missing columns in projects table
-- Run this if you get "Could not find the 'video_url' column" error

-- Add missing columns to projects table if they don't exist
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