# Build stage
FROM node:20-slim AS builder

# Install build dependencies
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
    pkg-config \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create symlink for python command
RUN ln -s /usr/bin/python3 /usr/bin/python

# Install Python dependencies
RUN pip3 install --no-cache-dir \
    manim \
    numpy \
    matplotlib \
    pillow \
    pycairo

WORKDIR /app

# Copy package files and install Node.js dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-slim AS production

# Install only runtime dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    ffmpeg \
    libcairo2 \
    libpango-1.0-0 \
    fonts-dejavu \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/* \
    && rm -rf /var/tmp/*

# Create symlink for python command
RUN ln -s /usr/bin/python3 /usr/bin/python

# Copy Python packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

WORKDIR /app

# Copy built application and dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Set environment variables for build and runtime
ENV NEXT_PUBLIC_SUPABASE_URL=https://zcjvdcndsrguevdpgptw.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjanZkY25kc3JndWV2ZHBncHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzE4MzIsImV4cCI6MjA3NDA0NzgzMn0.sVd2tn4p5PXb78m5Tywy3hcdT9XBlwn9asK8AzLHGBE

# Build the Next.js application
RUN npm run build

# Expose port
EXPOSE 8080

# Start the application using npm
CMD ["npm", "run", "start"]