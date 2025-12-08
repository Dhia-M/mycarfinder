import { Router } from 'express';
import {
    getDashboardStats,
    getAllVehicles,
    deleteVehicleAdmin,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserRole,
} from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

// Dashboard
router.get('/stats', getDashboardStats);

// Vehicle management
router.get('/vehicles', getAllVehicles);
router.delete('/vehicles/:id', deleteVehicleAdmin);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.post('/users/:id/role', updateUserRole);

export default router;
