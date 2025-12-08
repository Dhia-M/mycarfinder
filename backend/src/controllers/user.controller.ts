import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import bcrypt from 'bcrypt';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
                phone: true,
                role: true,
                isVerified: true,
                createdAt: true,
                _count: {
                    select: {
                        vehicles: true,
                    },
                },
            },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const { firstName, lastName, phone, avatar, currentPassword, newPassword } = req.body;

        // If updating password, verify current password
        if (newPassword) {
            if (!currentPassword) {
                res.status(400).json({ error: 'Current password is required' });
                return;
            }

            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            const isPasswordValid = await bcrypt.compare(currentPassword, user!.password);
            if (!isPasswordValid) {
                res.status(401).json({ error: 'Current password is incorrect' });
                return;
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    firstName,
                    lastName,
                    phone,
                    avatar,
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    phone: true,
                    role: true,
                },
            });

            res.json(updatedUser);
            return;
        }

        // Update profile without password
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName,
                lastName,
                phone,
                avatar,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
                phone: true,
                role: true,
            },
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

export const getUserVehicles = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const vehicles = await prisma.vehicle.findMany({
            where: {
                userId,
                status: 'PUBLISHED', // Only show published vehicles
            },
            include: {
                _count: {
                    select: {
                        timelineEvents: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json(vehicles);
    } catch (error) {
        console.error('Get user vehicles error:', error);
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
};
