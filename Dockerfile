# Use multi-stage build for Python + Node.js
FROM python:3.11-slim AS python-base

# Install system dependencies for Manim
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libcairo2-dev \
    libpango1.0-dev \
    libffi-dev \
    libjpeg-dev \
    libpng-dev \
    fonts-dejavu \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-extra-utils \
    texlive-latex-extra \
    texlive-fonts-extra \
    texlive-xetex \
    texlive-plain-generic \
    pkg-config \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir \
    manim \
    numpy \
    scipy \
    matplotlib \
    pillow \
    opencv-python \
    jupyter \
    notebook \
    pycairo \
    setuptools \
    wheel

# Node.js stage
FROM node:20-alpine AS node-base

# Install Python and system deps for Node.js stage
RUN apk add --no-cache python3 py3-pip ffmpeg cairo-dev pango-dev gdk-pixbuf-dev

# Copy Python environment from python-base
COPY --from=python-base /usr/local/lib/python3.11 /usr/local/lib/python3.11
COPY --from=python-base /usr/local/bin /usr/local/bin

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci

# Copy source code
COPY . .

# Set environment variables for build and runtime
ENV NEXT_PUBLIC_SUPABASE_URL=https://zcjvdcndsrguevdpgptw.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjanZkY25kc3JndWV2ZHBncHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzE4MzIsImV4cCI6MjA3NDA0NzgzMn0.sVd2tn4p5PXb78m5Tywy3hcdT9XBlwn9asK8AzLHGBE

# Build the Next.js application
RUN npm run build

# Expose port
EXPOSE 8080

# Start the application using npm
CMD ["npm", "run", "start"]