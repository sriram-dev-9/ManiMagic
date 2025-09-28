# 🎬 ManiMagic - Interactive Mathematical Animation Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python)](https://python.org/)
[![Manim](https://img.shields.io/badge/Manim-Latest-orange?style=for-the-badge)](https://www.manim.community/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Railway](https://img.shields.io/badge/Railway-Deployment-purple?style=for-the-badge&logo=railway)](https://railway.app/)

> **Transform mathematical concepts into stunning animations with the power of Python's Manim library, now accessible through an intuitive web interface.**

## 🌟 Overview

**ManiMagic** is a comprehensive web-based platform that democratizes mathematical animation creation. Built on top of Python's powerful Manim library, it provides an interactive playground where educators, students, and animation enthusiasts can create, share, and discover beautiful mathematical visualizations without the complexity of local setup.

🔗 **GitHub Repository:** [https://github.com/sriram-dev-9/ManiMagic](https://github.com/sriram-dev-9/ManiMagic)

## ✨ Core Features

### 🎯 Animation Creation Engine
- **Interactive Code Editor**: Monaco-powered editor with syntax highlighting and auto-completion
- **Live Preview**: Real-time code execution and animation preview
- **Error Handling**: Comprehensive error reporting with helpful suggestions
- **Export Capabilities**: Download high-quality MP4 animations

### 🌐 Community Platform
- **Project Showcase**: Browse and discover animations from the community
- **User Profiles**: Personalized creator profiles with animation galleries
- **Search & Discovery**: Advanced search with filtering by popularity, recency, and trending
- **Social Features**: *(Currently disabled - coming soon)*
  - Like and favorite animations
  - Comment system with threaded discussions
  - Follow favorite creators

### 🔐 Authentication & User Management
- **Secure Authentication**: Powered by Supabase Auth
- **Social Login**: Google and GitHub OAuth integration
- **Profile Management**: Customizable user profiles with avatars
- **Project Ownership**: Track and manage your created animations

### 🎨 User Experience
- **Dark/Light Themes**: Comfortable coding in any environment
- **Responsive Design**: Seamless experience across desktop and mobile
- **Performance Optimized**: Fast loading with efficient caching
- **Accessibility**: WCAG compliant interface design

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS + Custom Theme System
- **State Management**: React Hooks + Context API
- **Code Editor**: Monaco Editor (VS Code engine)
- **Icons**: React Icons library
- **Authentication**: Supabase Auth Client

### Backend Infrastructure
- **Database**: PostgreSQL via Supabase
- **Python Runtime**: Docker containers with Manim
- **File Storage**: Supabase Storage for videos/assets
- **API**: Next.js API routes + Supabase RPC
- **Deployment**: Railway with Docker multi-stage builds

### Key Technologies
```bash
Frontend:     Next.js, React, TypeScript, Tailwind CSS
Backend:      Python, Manim, Node.js, PostgreSQL
Database:     Supabase (PostgreSQL + Auth + Storage)
Deployment:   Railway, Docker
DevTools:     ESLint, PostCSS, VS Code extensions
```
## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm
- Python 3.11+
- Docker (for deployment)
- Supabase account

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sriram-dev-9/ManiMagic.git
   cd ManiMagic/ManiMagic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Create .env.local file
   cp .env.example .env.local
   
   # Add your Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Create an account or sign in
   - Start creating animations!

### Database Setup

The application uses Supabase for data management. Key tables include:

- `profiles` - User profile information
- `projects` - Animation projects and metadata
- `project_likes` - Like relationships *(feature disabled)*
- `comments` - Comment system *(feature disabled)*

## 🎯 Usage Guide

### Creating Your First Animation

1. **Sign in** to your account
2. **Navigate to the Playground** from the main menu
3. **Write your Manim code** in the editor:
   ```python
   from manim import *
   
   class HelloWorld(Scene):
       def construct(self):
           text = Text("Hello, ManiMagic!")
           self.play(Write(text))
           self.wait(2)
   ```
4. **Click "Run Animation"** to generate your video
5. **Download or Share** your creation with the community

### Exploring the Community

1. **Visit the Community page** to browse animations
2. **Use the search bar** to find specific topics
3. **Filter by popularity** or recent uploads
4. **Click any animation** to view details and code
5. **Follow creators** you find inspiring *(coming soon)*

## � Development

### Project Structure
```
ManiMagic/
├── app/                    # Next.js app directory
│   ├── components/         # Reusable React components
│   ├── community/          # Community showcase pages
│   ├── login/             # Authentication pages
│   ├── project/           # Individual project pages
│   └── globals.css        # Global styles
├── lib/                   # Utility libraries
│   ├── supabase/          # Database configuration
│   └── community.ts       # Community API functions
├── hooks/                 # Custom React hooks
├── public/                # Static assets
└── Dockerfile            # Container configuration
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint checks
npm run type-check   # TypeScript type checking
```
## 📖 Advanced Usage

### Code Editor Features
- **Monaco Editor** with Python syntax highlighting
- **Real-time error detection** and validation
- **Auto-completion** for Manim objects and methods
- **Template library** with example animations
- **Dark/Light theme** support

### API Endpoints

**POST** `/api/run-manim`
```javascript
// Generate animation from Manim code
{
  "code": "from manim import *\n\nclass MyScene(Scene):\n    def construct(self):\n        circle = Circle()\n        self.play(Create(circle))"
}
```