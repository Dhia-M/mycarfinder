import { Router } from 'express';
import { getProfile, updateProfile, getUserVehicles } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/:userId/vehicles', getUserVehicles);

export default router;
