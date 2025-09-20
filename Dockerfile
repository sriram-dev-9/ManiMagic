# Use official Python image as base (same as Manim Community official image)
FROM python:3.11-slim

# Install system dependencies for Manim (based on official Dockerfile)
RUN apt-get update -qq \
    && apt-get install --no-install-recommends -y \
        build-essential \
        gcc \
        cmake \
        libcairo2-dev \
        libffi-dev \
        libpango1.0-dev \
        freeglut3-dev \
        ffmpeg \
        pkg-config \
        make \
        wget \
        ghostscript \
        fonts-noto \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18 LTS
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

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

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Next.js application
RUN npm run build

# Remove dev dependencies after build to reduce image size
RUN npm prune --production

# Expose port (Railway will override this with $PORT)
EXPOSE 8080

# Set environment variables for Railway
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=8080

# Verify Python and Manim installation
RUN python --version && python -c "import manim; print('Manim successfully imported')"

# Start the application using standalone server
CMD ["node", ".next/standalone/server.js"]