# Use Node.js base with Debian
FROM node:20-bullseye-slim

# Install system dependencies for Manim (based on official manim docker image)
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    python3-pip \
    python3-dev \
    ffmpeg \
    libcairo2-dev \
    libpango1.0-dev \
    pkg-config \
    fonts-dejavu \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/* \
    && rm -rf /var/tmp/*

# Create symlink for python command
RUN ln -s /usr/bin/python3 /usr/bin/python

# Upgrade pip
RUN python3 -m pip install --upgrade pip

# Install Python dependencies for Manim
RUN python3 -m pip install --no-cache-dir \
    manim \
    numpy \
    pillow \
    && python3 -m pip cache purge

# Verify manim installation
RUN python3 -m manim --version

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies (production only to save space)
RUN npm ci --omit=dev && npm cache clean --force

# Copy source code
COPY . .

# Set environment variables
ENV NEXT_PUBLIC_SUPABASE_URL=https://zcjvdcndsrguevdpgptw.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjanZkY25kc3JndWV2ZHBncHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzE4MzIsImV4cCI6MjA3NDA0NzgzMn0.sVd2tn4p5PXb78m5Tywy3hcdT9XBlwn9asK8AzLHGBE

# Build the Next.js application
RUN npm run build

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start"]
