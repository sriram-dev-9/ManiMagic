#!/bin/bash

# Railway Deployment Helper Script
# This script helps with Railway deployment setup

echo "🚂 ManiMagic Railway Deployment Helper"
echo "====================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "Checking Railway login..."
railway login

# Link project (if not already linked)
if [ ! -f ".railway/project.json" ]; then
    echo "Linking to Railway project..."
    railway link
fi

# Deploy
echo "Deploying to Railway..."
railway up

echo "✅ Deployment complete!"
echo "Check your Railway dashboard for the deployment status."
echo "Your app will be available at the Railway-provided URL."