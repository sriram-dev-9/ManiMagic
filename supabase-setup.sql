-- Supabase Database Setup for ManiMagic
-- Run these commands in your Supabase SQL editor

-- Enable RLS (Row Level Security)
-- This is usually enabled by default, but just to be sure
-- alter table auth.users enable row level security;

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint username_length check (char_length(username) >= 3)
);

-- Create projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  code text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_public boolean default false not null,
  tags text[] default '{}'::text[],
  video_url text, -- URL to the animation video
  thumbnail_url text, -- URL to the video thumbnail
  likes_count integer default 0 not null,
  comments_count integer default 0 not null,
  views_count integer default 0 not null
);

-- Create likes table
create table public.likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, project_id)
);

-- Create comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  content text not null,
  parent_id uuid references public.comments(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create views table for tracking video views
create table public.project_views (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ip_address text,
  unique(user_id, project_id)
);

-- Set up Row Level Security (RLS)
-- Enable RLS on profiles table
alter table public.profiles enable row level security;

-- Enable RLS on projects table  
alter table public.projects enable row level security;

-- Enable RLS on likes table
alter table public.likes enable row level security;

-- Enable RLS on comments table
alter table public.comments enable row level security;

-- Enable RLS on project_views table
alter table public.project_views enable row level security;

-- Create policies for profiles table
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create policies for projects table
create policy "Public projects are viewable by everyone." on public.projects
  for select using (is_public = true);

create policy "Users can view their own projects." on public.projects
  for select using (auth.uid() = user_id);

create policy "Users can insert their own projects." on public.projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own projects." on public.projects
  for update using (auth.uid() = user_id);

create policy "Users can delete their own projects." on public.projects
  for delete using (auth.uid() = user_id);

-- Create policies for likes table
create policy "Anyone can view likes." on public.likes
  for select using (true);

create policy "Users can like projects." on public.likes
  for insert with check (auth.uid() = user_id);

create policy "Users can unlike their own likes." on public.likes
  for delete using (auth.uid() = user_id);

-- Create policies for comments table
create policy "Anyone can view comments." on public.comments
  for select using (true);

create policy "Authenticated users can comment." on public.comments
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own comments." on public.comments
  for update using (auth.uid() = user_id);

create policy "Users can delete their own comments." on public.comments
  for delete using (auth.uid() = user_id);

-- Create policies for project_views table
create policy "Anyone can view project views." on public.project_views
  for select using (true);

create policy "Anyone can add views." on public.project_views
  for insert with check (true);

-- Function to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Trigger to automatically create profile when user signs up
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Trigger to update updated_at on projects
create trigger handle_projects_updated_at
  before update on public.projects
  for each row execute procedure public.handle_updated_at();

-- Trigger to update updated_at on comments
create trigger handle_comments_updated_at
  before update on public.comments
  for each row execute procedure public.handle_updated_at();

-- Function to update likes count
create or replace function public.update_likes_count()
returns trigger
language plpgsql
as $$
begin
  if TG_OP = 'INSERT' then
    update public.projects 
    set likes_count = likes_count + 1 
    where id = NEW.project_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.projects 
    set likes_count = likes_count - 1 
    where id = OLD.project_id;
    return OLD;
  end if;
  return null;
end;
$$;

-- Function to update comments count
create or replace function public.update_comments_count()
returns trigger
language plpgsql
as $$
begin
  if TG_OP = 'INSERT' then
    update public.projects 
    set comments_count = comments_count + 1 
    where id = NEW.project_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.projects 
    set comments_count = comments_count - 1 
    where id = OLD.project_id;
    return OLD;
  end if;
  return null;
end;
$$;

-- Function to update views count
create or replace function public.update_views_count()
returns trigger
language plpgsql
as $$
begin
  if TG_OP = 'INSERT' then
    update public.projects 
    set views_count = views_count + 1 
    where id = NEW.project_id;
    return NEW;
  end if;
  return null;
end;
$$;

-- Triggers for count updates
create trigger update_likes_count_trigger
  after insert or delete on public.likes
  for each row execute procedure public.update_likes_count();

create trigger update_comments_count_trigger
  after insert or delete on public.comments
  for each row execute procedure public.update_comments_count();

create trigger update_views_count_trigger
  after insert on public.project_views
  for each row execute procedure public.update_views_count();

-- Create storage bucket for user uploads (animations, avatars, etc.)
-- Use INSERT with ON CONFLICT to avoid errors if bucket already exists
insert into storage.buckets (id, name, public)
values ('manimagic-storage', 'manimagic-storage', true)
on conflict (id) do nothing;

-- Also create a separate videos bucket as backup
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

-- Set up storage policies
create policy "Give users access to own folder 1oj01fe_0" on storage.objects
  for select using (auth.uid()::text = (storage.foldername(name))[1]);

create policy "Give users access to own folder 1oj01fe_1" on storage.objects
  for insert with check (auth.uid()::text = (storage.foldername(name))[1]);

create policy "Give users access to own folder 1oj01fe_2" on storage.objects
  for update using (auth.uid()::text = (storage.foldername(name))[1]);

create policy "Give users access to own folder 1oj01fe_3" on storage.objects
  for delete using (auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public access to avatars
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'manimagic-storage' and (storage.foldername(name))[2] = 'avatars');

-- Allow public access to public animations
create policy "Public animations are publicly accessible." on storage.objects
  for select using (bucket_id = 'manimagic-storage' and (storage.foldername(name))[2] = 'animations');

-- Allow public access to public videos
create policy "Public videos are publicly accessible." on storage.objects
  for select using (bucket_id = 'manimagic-storage' and (storage.foldername(name))[2] = 'videos');

-- Backup policies for videos bucket
create policy "Videos bucket - user access select" on storage.objects
  for select using (bucket_id = 'videos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Videos bucket - user access insert" on storage.objects
  for insert with check (bucket_id = 'videos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Videos bucket - public access" on storage.objects
  for select using (bucket_id = 'videos');