@echo off
REM Helper script to start the application in production mode (Windows)

echo 🚀 Starting Vehicle Marketplace in Production Mode...
echo.

REM Check if .env file exists
if not exist "backend\.env" (
    echo ⚠️  Warning: backend\.env not found
    echo Creating from .env.example...
    copy "backend\.env.example" "backend\.env"
    echo ⚠️  Please edit backend\.env with your credentials before deploying to production!
    echo.
)

REM Build and start services
echo 📦 Building and starting Docker containers...
docker compose down
docker compose build --no-cache
docker compose up -d

REM Wait for services to be healthy
echo.
echo ⏳ Waiting for services to be healthy...
timeout /t 10 /nobreak > nul

REM Check status
docker compose ps

echo.
echo ✅ Application started!
echo.
echo 📍 Access points:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000/api
echo    Database: localhost:5432
echo.
echo 👤 Default login credentials:
echo    Admin: admin@vehiclemarket.com / admin123
echo    User:  john.doe@example.com / user123
echo.
echo 📝 View logs with: docker compose logs -f
echo 🛑 Stop with: docker compose down
pause
