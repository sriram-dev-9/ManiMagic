# ManiMagic Deployment Guide

## Docker Setup (Local Development & Self-Hosting)

This application uses Docker to ensure Python and Manim are available regardless of the deployment environment.

### Prerequisites
- Docker installed on your system
- Docker Compose installed

### Quick Start with Docker

1. **Build and run locally:**
   ```bash
   npm run docker:dev
   ```

2. **Build for production:**
   ```bash
   npm run docker:build
   npm run docker:prod
   ```

3. **Stop containers:**
   ```bash
   npm run docker:stop
   ```

### Manual Docker Commands

```bash
# Build the image
docker build -t manimagic .

# Run locally
docker run -p 3000:3000 manimagic

# Run with docker-compose
docker-compose up --build
```

## Deployment Options

### ❌ Vercel (Not Recommended)
Vercel does **NOT** support Docker containers. It only supports:
- Node.js applications
- Limited Python serverless functions
- No persistent file system for video generation

### ✅ Recommended Alternatives

#### 1. 🚂 Railway (Recommended - Easiest Docker Deploy)

Railway automatically detects your Docker setup and deploys your containerized app.

##### Step-by-Step Railway Deployment:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub (recommended)

2. **Connect Your Repository**
   - Click "New Project" → "Deploy from GitHub repo"
   - Search and select your `ManiMagic` repository
   - Click "Deploy"

3. **Railway Auto-Configuration**
   - Railway automatically detects your `Dockerfile`
   - Builds your Docker container
   - Deploys to Railway's infrastructure

4. **Set Environment Variables** (Optional)
   - Go to your project dashboard
   - Click "Variables" tab
   - Add any variables from `.env.example`

5. **Access Your App**
   - Railway provides a `*.railway.app` URL
   - Your app is live!

##### Railway Features for ManiMagic:
- ✅ **Automatic Docker builds** from your `Dockerfile`
- ✅ **Python + Node.js support** in same container
- ✅ **Persistent file system** for video generation
- ✅ **Auto-scaling** based on traffic
- ✅ **Free tier** available (512MB RAM, 1GB disk)
- ✅ **Custom domains** support

##### Railway Pricing:
- **Free**: 512MB RAM, 1GB disk, 1GB bandwidth
- **Hobby**: $5/month (8GB RAM, 32GB disk)
- **Pro**: $10/month (16GB RAM, 100GB disk)

##### Railway Optimization Tips:

```bash
# For better performance on Railway:
# 1. Use Railway's persistent disks for video storage
# 2. Monitor memory usage (Manim can be RAM intensive)
# 3. Use Railway's environment variables for configuration
# 4. Enable Railway's build caching for faster deployments
```

##### Railway Environment Setup:
```bash
# Copy .env.example to .env.local for local development
cp .env.example .env.local

# Railway will automatically use environment variables
# Set them in Railway dashboard under "Variables" tab
```

#### 2. Render
```bash
# Supports Docker with free tier
# Automatic builds from GitHub
# Good for Next.js + Python apps
```

#### 3. DigitalOcean App Platform
```bash
# Full Docker support
# Good performance for media processing
# Pay-as-you-go pricing
```

#### 4. AWS (Advanced)
- **ECS/Fargate**: Full container orchestration
- **Lambda**: Serverless functions with container images
- **EC2**: Traditional VPS with Docker

#### 5. Self-Hosting
```bash
# On your own server/VPS
docker-compose up -d
```

### Environment Variables

Create a `.env.local` file for local development:
```env
NODE_ENV=development
# Add any other environment variables your app needs
```

### Production Considerations

1. **Video Storage**: Consider using cloud storage (AWS S3, Cloudflare R2) for generated videos
2. **Caching**: Implement Redis for caching rendered videos
3. **Scaling**: Use a reverse proxy (nginx) for load balancing
4. **Monitoring**: Add logging and error tracking

### Troubleshooting

**Common Docker Issues:**
- Ensure Docker Desktop is running
- Check available disk space
- Clear Docker cache: `docker system prune`

**Manim Issues:**
- Videos are generated in `/tmp` directory
- Ensure sufficient RAM (4GB+ recommended)
- Check logs for LaTeX/font errors

### Performance Tips

- Use `docker build --no-cache` for clean builds
- Mount volumes for persistent data
- Use multi-stage builds to reduce image size
- Consider GPU acceleration for faster rendering (advanced)