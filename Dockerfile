# Use Node.js base image with Python support
FROM node:20-bullseye

# Install system dependencies for Manim and Python
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
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

# Create symlink for python command
RUN ln -s /usr/bin/python3 /usr/bin/python

# Install Python dependencies
RUN pip3 install --no-cache-dir \
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