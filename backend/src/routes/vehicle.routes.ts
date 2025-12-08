import { Router } from 'express';
import {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    uploadVehicleImages,
    getMyVehicles,
} from '../controllers/vehicle.controller';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Public routes (but track views if authenticated)
router.get('/', getVehicles);
router.get('/:id', optionalAuthenticate, getVehicleById);

// Protected routes
router.post('/', authenticate, createVehicle);
router.put('/:id', authenticate, updateVehicle);
router.delete('/:id', authenticate, deleteVehicle);
router.post('/upload', authenticate, upload.array('images', 10), uploadVehicleImages);
router.get('/my/vehicles', authenticate, getMyVehicles);

export default router;
