import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const senderId = req.user!.userId;
        const { receiverId, vehicleId, subject, content } = req.body;

        if (!receiverId || !content) {
            res.status(400).json({ error: 'Receiver and content are required' });
            return;
        }

        const message = await prisma.message.create({
            data: {
                senderId,
                receiverId,
                vehicleId,
                subject,
                content,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                vehicle: {
                    select: {
                        id: true,
                        make: true,
                        model: true,
                        year: true,
                        images: true,
                    },
                },
            },
        });

        res.status(201).json(message);
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;

        // Get all messages where user is sender or receiver
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                vehicle: {
                    select: {
                        id: true,
                        make: true,
                        model: true,
                        year: true,
                        images: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Group messages by conversation (other user)
        const conversationsMap = new Map();

        messages.forEach(message => {
            const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
            const otherUser = message.senderId === userId ? message.receiver : message.sender;

            const key = `${otherUserId}-${message.vehicleId || 'general'}`;

            if (!conversationsMap.has(key)) {
                conversationsMap.set(key, {
                    otherUser,
                    vehicle: message.vehicle,
                    lastMessage: message,
                    unreadCount: 0,
                    messages: [],
                });
            }

            const conv = conversationsMap.get(key);
            conv.messages.push(message);

            // Count unread messages (where current user is receiver)
            if (message.receiverId === userId && !message.isRead) {
                conv.unreadCount++;
            }
        });

        const conversations = Array.from(conversationsMap.values());

        res.json(conversations);
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
};

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const { otherUserId, vehicleId } = req.query;

        if (!otherUserId) {
            res.status(400).json({ error: 'Other user ID is required' });
            return;
        }

        const where: any = {
            OR: [
                { senderId: userId, receiverId: otherUserId as string },
                { senderId: otherUserId as string, receiverId: userId },
            ],
        };

        if (vehicleId) {
            where.vehicleId = vehicleId as string;
        }

        const messages = await prisma.message.findMany({
            where,
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                vehicle: {
                    select: {
                        id: true,
                        make: true,
                        model: true,
                        year: true,
                        images: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        // Mark messages as read where current user is receiver
        await prisma.message.updateMany({
            where: {
                receiverId: userId,
                senderId: otherUserId as string,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });

        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const { messageIds } = req.body;

        if (!messageIds || !Array.isArray(messageIds)) {
            res.status(400).json({ error: 'Message IDs array is required' });
            return;
        }

        await prisma.message.updateMany({
            where: {
                id: { in: messageIds },
                receiverId: userId,
            },
            data: {
                isRead: true,
            },
        });

        res.json({ message: 'Messages marked as read' });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ error: 'Failed to mark messages as read' });
    }
};

export const getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;

        const count = await prisma.message.count({
            where: {
                receiverId: userId,
                isRead: false,
            },
        });

        res.json({ count });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ error: 'Failed to get unread count' });
    }
};
