import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const [totalUsers, totalVehicles, publishedVehicles, soldVehicles] = await Promise.all([
            prisma.user.count(),
            prisma.vehicle.count(),
            prisma.vehicle.count({ where: { status: 'PUBLISHED' } }),
            prisma.vehicle.count({ where: { status: 'SOLD' } }),
        ]);

        // Get new users this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const newUsersThisMonth = await prisma.user.count({
            where: {
                createdAt: {
                    gte: startOfMonth,
                },
            },
        });

        const newVehiclesThisMonth = await prisma.vehicle.count({
            where: {
                createdAt: {
                    gte: startOfMonth,
                },
            },
        });

        res.json({
            totalUsers,
            totalVehicles,
            publishedVehicles,
            soldVehicles,
            newUsersThisMonth,
            newVehiclesThisMonth,
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};

export const getAllVehicles = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {
            page = '1',
            limit = '2',
            status,
            search,
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const where: any = {};
        if (status) where.status = status;
        if (search) {
            where.OR = [
                { make: { contains: search as string, mode: 'insensitive' } },
                { model: { contains: search as string, mode: 'insensitive' } },
                { vin: { contains: search as string, mode: 'insensitive' } },
            ];
        }

        const [total, vehicles] = await Promise.all([
            prisma.vehicle.count({ where }),
            prisma.vehicle.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limitNum,
            }),
        ]);

        res.json({
            vehicles,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        console.error('Get all vehicles error:', error);
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
};

export const deleteVehicleAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.vehicle.delete({
            where: { id },
        });

        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Delete vehicle error:', error);
        res.status(500).json({ error: 'Failed to delete vehicle' });
    }
};

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {
            page = '1',
            limit = '20',
            search,
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const where: any = {};
        if (search) {
            where.OR = [
                { firstName: { contains: search as string, mode: 'insensitive' } },
                { lastName: { contains: search as string, mode: 'insensitive' } },
                { email: { contains: search as string, mode: 'insensitive' } },
            ];
        }

        const [total, users] = await Promise.all([
            prisma.user.count({ where }),
            prisma.user.findMany({
                where,
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
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limitNum,
            }),
        ]);

        res.json({
            users,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
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
                vehicles: {
                    select: {
                        id: true,
                        make: true,
                        model: true,
                        year: true,
                        status: true,
                        createdAt: true,
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
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.user.delete({
            where: { id },
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['USER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
            res.status(400).json({ error: 'Invalid role' });
            return;
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        });

        res.json(user);
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({ error: 'Failed to update user role' });
    }
};
