#!/bin/bash
# Helper script to start the application in development mode with hot reload

echo "🛠️  Starting Vehicle Marketplace in Development Mode (Hot Reload)..."
echo ""

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env not found"
    echo "Creating from .env.example..."
    cp backend/.env.example backend/.env
    echo "✏️  Please edit backend/.env with your development credentials"
    echo ""
fi

# Start services in development mode
echo "📦 Starting Docker containers in development mode..."
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up

# Note: This will show logs in foreground
# Use Ctrl+C to stop
