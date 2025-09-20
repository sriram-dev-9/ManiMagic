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
    py3-pip \
    ffmpeg \
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
    zlib-dev

# Copy Python environment from python-base
COPY --from=python-base /usr/local/lib/python3.11 /usr/local/lib/python3.11
COPY --from=python-base /usr/local/bin /usr/local/bin

# Create symlinks for Python
RUN ln -sf /usr/local/bin/python3.11 /usr/bin/python && \
    ln -sf /usr/local/bin/python3.11 /usr/bin/python3 && \
    ln -sf /usr/local/bin/pip3.11 /usr/bin/pip && \
    ln -sf /usr/local/bin/pip3.11 /usr/bin/pip3

# Set Python path
ENV PYTHONPATH=/usr/local/lib/python3.11/site-packages
ENV PATH=/usr/local/bin:$PATH

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install Node.js dependencies (this layer will be cached if package.json doesn't change)
RUN npm ci --only=production

# Copy source code (this layer changes most frequently)
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port (Railway will override this with $PORT)
EXPOSE 3000

# Set environment variables for Railway
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Verify Python and Manim installation
RUN python --version && python -c "import manim; print('Manim successfully imported')"

# Start the application
CMD ["npm", "start"]