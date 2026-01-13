@echo off
REM Helper script to start the application in development mode with hot reload (Windows)

echo 🛠️  Starting Vehicle Marketplace in Development Mode (Hot Reload)...
echo.

REM Check if .env file exists
if not exist "backend\.env" (
    echo ⚠️  Warning: backend\.env not found
    echo Creating from .env.example...
    copy "backend\.env.example" "backend\.env"
    echo ✏️  Please edit backend\.env with your development credentials
    echo.
)

REM Start services in development mode
echo 📦 Starting Docker containers in development mode...
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up

REM Note: This will show logs in foreground
REM Use Ctrl+C to stop
