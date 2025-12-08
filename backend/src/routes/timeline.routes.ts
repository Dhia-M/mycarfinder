import { Router } from 'express';
import {
    createTimelineEvent,
    updateTimelineEvent,
    deleteTimelineEvent,
    uploadEventImage,
} from '../controllers/timeline.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router({ mergeParams: true });

router.post('/', authenticate, createTimelineEvent);
router.put('/:eventId', authenticate, updateTimelineEvent);
router.delete('/:eventId', authenticate, deleteTimelineEvent);
router.post('/upload', authenticate, upload.single('image'), uploadEventImage);

export default router;
