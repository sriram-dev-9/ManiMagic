# Use Node.js base with Debian (not Alpine) for better Python compatibility
FROM node:20-bullseye-slim

# Install system dependencies (minimal set without LaTeX to save space)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    ffmpeg \
    libcairo2 \
    libcairo2-dev \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libglib2.0-0 \
    fonts-dejavu \
    pkg-config \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/* \
    && rm -rf /var/tmp/*

# Update pip to latest version
RUN python3 -m pip install --upgrade pip

# Create symlink for python command
RUN ln -s /usr/bin/python3 /usr/bin/python

# Install Python dependencies for Manim with explicit paths
RUN python3 -m pip install --no-cache-dir \
    manim \
    numpy \
    pillow \
    pycairo \
    scipy \
    && python3 -m pip cache purge

# Verify manim installation
RUN python3 -m manim --version || echo "Manim installation check failed"

# Add local bin to PATH for Python modules
ENV PATH="/usr/local/bin:${PATH}"
ENV PYTHONPATH="/usr/local/lib/python3.9/site-packages:${PYTHONPATH}"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy source code
COPY . .

# Set environment variables for build and runtime
ENV NEXT_PUBLIC_SUPABASE_URL=https://zcjvdcndsrguevdpgptw.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjanZkY25kc3JndWV2ZHBncHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzE4MzIsImV4cCI6MjA3NDA0NzgzMn0.sVd2tn4p5PXb78m5Tywy3hcdT9XBlwn9asK8AzLHGBE

# Build the Next.js application
RUN npm run build

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start"]
