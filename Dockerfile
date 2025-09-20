# Use multi-stage build for Python + Node.js
FROM python:3.11-slim as python-base

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
FROM node:18-alpine as node-base

# Install Python and system deps for Node.js stage including required libraries
RUN apk add --no-cache \
    python3 \
    python3-dev \
    py3-pip \
    py3-wheel \
    py3-setuptools \
    ffmpeg \
    ffmpeg-dev \
    ffmpeg-libs \
    cairo-dev \
    pango-dev \
    gdk-pixbuf-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    freetype-dev \
    fribidi-dev \
    harfbuzz-dev \
    jpeg-dev \
    lcms2-dev \
    openjpeg-dev \
    tcl-dev \
    tiff-dev \
    tk-dev \
    zlib-dev \
    gcc \
    g++ \
    musl-dev \
    linux-headers \
    pkgconf \
    pkgconfig

# Install Manim and dependencies directly in Alpine (using --break-system-packages for Docker)
RUN pip3 install --no-cache-dir --break-system-packages \
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

# Set Python path and ensure python3 is accessible as python
RUN ln -sf /usr/bin/python3 /usr/bin/python
ENV PYTHONPATH=/usr/lib/python3.11/site-packages:/usr/local/lib/python3.11/site-packages
ENV PATH=/usr/local/bin:$PATH

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy source code (this layer changes most frequently)
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

# Verify Python and Manim installation (use Alpine's python3)
RUN python3 --version && python3 -c "import manim; print('Manim successfully imported')"

# Start the application
CMD ["npm", "start"]