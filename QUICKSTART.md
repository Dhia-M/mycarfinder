# Quick Start Guide

## Get Up and Running in 5 Minutes!

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Git installed

### Step 1: Set Up the Database

1. **Create a PostgreSQL database**:
```bash
# Using psql
createdb vehicle_marketplace

# Or using PostgreSQL client
psql -U postgres
CREATE DATABASE vehicle_marketplace;
\q
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your database credentials
# Minimum required:
# DATABASE_URL="postgresql://your_user:your_password@localhost:5432/vehicle_marketplace"

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed

# Start the backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 3: Frontend Setup

Open a **new terminal window**:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment file (optional, default works)
cp .env.example .env

# Start the frontend server
npm run dev
```

Frontend will run on `http://localhost:5173`

### Step 4: Access the Application

Open your browser and go to: **http://localhost:5173**

### Step 5: Login

Use these demo accounts:

**Admin Account:**
- Email: `admin@vehiclemarket.com`
- Password: `admin123`

**Regular User:**
- Email: `john.doe@example.com`
- Password: `user123`

## What's Included

✅ **Complete Backend API** with authentication, vehicles, timelines, and admin endpoints
✅ **Database Schema** with User, Vehicle, and TimelineEvent models
✅ **Sample Data** with 3 vehicles and complete timeline history
✅ **Authentication System** with JWT and refresh tokens
✅ **Basic Frontend** with routing, auth pages, and landing page

## What Needs to be Built

The frontend currently has placeholder pages with TODO markers. You need to implement:

1. **Vehicle Listing Page** - Grid/list view with filters
2. **Vehicle Detail Page** - Including the **interactive timeline component** (CRITICAL)
3. **Vehicle Form** - Multi-step form with timeline builder
4. **Dashboard** - User profile and vehicle management
5. **Admin Panel** - Stats, vehicle, and user management

All backend APIs are ready and working. The frontend skeleton is set up with:
- React Router configured
- Authentication working
- Zustand state management
- TailwindCSS + Shadcn/ui ready
- API client configured

## Quick Testing

### Test the Backend API

```bash
# Health check
curl http://localhost:5000/health

# Get vehicles
curl http://localhost:5000/api/vehicles

# Login (get access token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vehiclemarket.com","password":"admin123"}'
```

### Test Database with Prisma Studio

```bash
cd backend
npm run prisma:studio
```

This opens a visual database browser at `http://localhost:5555`

## Troubleshooting

**Database connection error?**
- Check PostgreSQL is running: `pg_isctl status` or `sudo service postgresql status`
- Verify DATABASE_URL in `.env`
- Test connection: `psql -U postgres -d vehicle_marketplace`

**Port already in use?**
- Backend (5000): Change PORT in `backend/.env`
- Frontend (5173): Change port in `frontend/vite.config.ts`

**Prisma errors?**
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

## Next Steps

1. **Explore the seed data** - 3 vehicles with complete timeline history
2. **Test the APIs** - All endpoints are documented in README.md
3. **Build the frontend** - Start with the vehicle listing page
4. **Implement the timeline** - The most critical feature
5. **Add Cloudinary** - For actual image uploads (currently using URLs)

## Development Workflow

```bash
# Backend (terminal 1)
cd backend
npm run dev

# Frontend (terminal 2)
cd frontend
npm run dev

# Database GUI (terminal 3, optional)
cd backend
npm run prisma:studio
```

## Need Help?

Check the main README.md for:
- Complete API documentation
- Project structure details
- Security features
- Deployment instructions

Happy coding! 🚀
