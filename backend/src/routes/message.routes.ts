import { Router } from 'express';
import { sendMessage, getConversations, getMessages, markAsRead, getUnreadCount } from '../controllers/message.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, sendMessage);
router.get('/conversations', authenticate, getConversations);
router.get('/unread-count', authenticate, getUnreadCount);
router.get('/', authenticate, getMessages);
router.put('/read', authenticate, markAsRead);

export default router;
