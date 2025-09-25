-- Fix for foreign key constraint error in projects table
-- Run this in your Supabase SQL editor

-- First, create or replace the ensure_user_profile function
CREATE OR REPLACE FUNCTION public.ensure_user_profile(user_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if profile exists, if not create it
  INSERT INTO public.profiles (id, full_name, username, created_at, updated_at)
  VALUES (
    user_uuid,
    COALESCE(
      (SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = user_uuid),
      (SELECT email FROM auth.users WHERE id = user_uuid),
      'User'
    ),
    COALESCE(
      (SELECT raw_user_meta_data->>'username' FROM auth.users WHERE id = user_uuid),
      (SELECT split_part(email, '@', 1) FROM auth.users WHERE id = user_uuid),
      'user_' || substr(user_uuid::text, 1, 8)
    ),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
END;
$$;

-- Also fix any existing users who might not have profiles
-- This will create profiles for any auth.users who don't have them
INSERT INTO public.profiles (id, full_name, username, created_at, updated_at)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email, 'User') as full_name,
  COALESCE(au.raw_user_meta_data->>'username', split_part(au.email, '@', 1), 'user_' || substr(au.id::text, 1, 8)) as username,
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'User'),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1), 'user_' || substr(NEW.id::text, 1, 8)),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.created_at,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'User'),
    username = COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1), 'user_' || substr(NEW.id::text, 1, 8)),
    avatar_url = NEW.raw_user_meta_data->>'avatar_url',
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();