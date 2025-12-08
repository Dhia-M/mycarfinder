# Vehicle E-Commerce Marketplace

A complete full-stack e-commerce platform for buying and selling new and used vehicles with comprehensive maintenance and modification history tracking.

## 🚀 Features

- **User Authentication**: JWT-based auth with refresh tokens and role-based access control
- **Vehicle Management**: Create, read, update, and delete vehicle listings
- **Interactive Timeline**: Visual timeline for vehicle maintenance history and modifications
- **Advanced Search & Filters**: Filter by make, model, year, price, condition, and more
- **Admin Panel**: Comprehensive dashboard for managing users and vehicles
- **Responsive Design**: Mobile-first design with dark mode support
- **Image Upload**: Cloudinary integration for vehicle images
- **Real-time Updates**: Optimistic UI updates with Zustand state management

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**
- **Cloudinary account** (for image uploads)

## 🛠️ Technology Stack

### Backend
- Node.js with Express.js
- PostgreSQL with Prisma ORM
- JWT Authentication
- Bcrypt for password hashing
- Multer + Cloudinary for file uploads
- TypeScript

### Frontend
- React 18+
- Vite
- TailwindCSS + Shadcn/ui
- Zustand (state management)
- React Router v6
- Framer Motion (animations)
- React Hook Form + Zod (form validation)
- Axios

## 📁 Project Structure

```
ecomm-vehicle/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   ├── store/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md
```

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ecomm-vehicle
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vehicle_marketplace"

JWT_ACCESS_SECRET="your-super-secret-access-token-change-this"
JWT_REFRESH_SECRET="your-super-secret-refresh-token-change-this"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

#### Set Up Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

#### Start Backend Server

```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
cp .env.example .env
```

Edit if needed (default should work):

```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 👤 Default Users

After running the seed script, you can log in with:

### Admin Account
- **Email**: admin@vehiclemarket.com
- **Password**: admin123
- **Role**: ADMIN

### Regular User Account
- **Email**: john.doe@example.com
- **Password**: user123
- **Role**: USER

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Vehicle Endpoints

- `GET /api/vehicles` - Get all vehicles (with filters)
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles` - Create vehicle (auth required)
- `PUT /api/vehicles/:id` - Update vehicle (owner only)
- `DELETE /api/vehicles/:id` - Delete vehicle (owner only)
- `POST /api/vehicles/upload` - Upload vehicle images
- `GET /api/vehicles/my/vehicles` - Get user's vehicles

### Timeline Event Endpoints

- `POST /api/vehicles/:vehicleId/timeline` - Add timeline event
- `PUT /api/vehicles/:vehicleId/timeline/:eventId` - Update event
- `DELETE /api/vehicles/:vehicleId/timeline/:eventId` - Delete event

### User Endpoints

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:userId/vehicles` - Get user's published vehicles

### Admin Endpoints

- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/vehicles` - Get all vehicles
- `DELETE /api/admin/vehicles/:id` - Delete any vehicle
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user by ID
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/users/:id/role` - Update user role

## 🎨 Key Features Implementation

### Interactive Timeline

The vehicle detail page includes an interactive timeline showing:
- Purchase history
- Maintenance records
- Upgrades and modifications
- Accidents and repairs
- Parts replacements

Events are color-coded:
- 🟢 Green: Purchase/Upgrade
- 🟡 Yellow: Maintenance
- 🔴 Red: Accident/Repair

### Search & Filter

Advanced filtering options:
- Make and model
- Year range
- Price range
- Mileage
- Fuel type
- Transmission type
- Condition (New/Used/Certified Pre-Owned)

### Admin Panel

Admins can:
- View dashboard statistics
- Manage all vehicles
- Manage all users
- Promote users to admin
- Delete vehicles and users

## 🔒 Security Features

- JWT authentication with refresh tokens
- HttpOnly cookies for refresh tokens
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- Input validation with Zod
- CORS configuration
- Helmet security headers
- SQL injection prevention (Prisma ORM)

## 🚢 Deployment

### Using Docker (Recommended)

A `docker-compose.yml` file is provided for easy deployment.

```bash
docker-compose up -d
```

### Manual Deployment

#### Backend (Node.js)

```bash
cd backend
npm run build
npm start
```

Deploy to platforms like:
- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean

#### Frontend (React)

```bash
cd frontend
npm run build
```

Deploy the `dist` folder to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

#### Database

Use managed PostgreSQL services:
- Neon
- Supabase
- AWS RDS
- Digital Ocean Managed Databases

## 📝 Development Scripts

### Backend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:seed      # Seed database
```

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database credentials
- Run `npm run prisma:generate`

### Cloudinary Upload Issues

- Verify Cloudinary credentials in `.env`
- Check file size limits (max 5MB)
- Ensure file is an image format

### CORS Errors

- Check `FRONTEND_URL` in backend `.env`
- Verify CORS configuration in `backend/src/index.ts`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Shadcn/ui for beautiful UI components
- Prisma for excellent ORM
- TailwindCSS for utility-first CSS

---

**Built with ❤️ for the vehicle marketplace community**
