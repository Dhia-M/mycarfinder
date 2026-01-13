#!/bin/bash
# Helper script to start the application in production mode

echo "🚀 Starting Vehicle Marketplace in Production Mode..."
echo ""

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env not found"
    echo "Creating from .env.example..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env with your credentials before deploying to production!"
    echo ""
fi

# Build and start services
echo "📦 Building and starting Docker containers..."
docker compose down
docker compose build --no-cache
docker compose up -d

# Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check status
docker compose ps

echo ""
echo "✅ Application started!"
echo ""
echo "📍 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000/api"
echo "   Database: localhost:5432"
echo ""
echo "👤 Default login credentials:"
echo "   Admin: admin@vehiclemarket.com / admin123"
echo "   User:  john.doe@example.com / user123"
echo ""
echo "📝 View logs with: docker compose logs -f"
echo "🛑 Stop with: docker compose down"
