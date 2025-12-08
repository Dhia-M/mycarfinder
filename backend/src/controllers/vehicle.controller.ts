import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToLocalStorage } from '../config/cloudinary.config';

export const getVehicles = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {
            page = '1',
            limit = '12',
            make,
            model,
            minYear,
            maxYear,
            minPrice,
            maxPrice,
            condition,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        // Build filter conditions
        const where: any = {
            status: 'PUBLISHED',
        };

        if (make) where.make = { contains: make as string, mode: 'insensitive' };
        if (model) where.model = { contains: model as string, mode: 'insensitive' };
        if (minYear || maxYear) {
            where.year = {};
            if (minYear) where.year.gte = parseInt(minYear as string);
            if (maxYear) where.year.lte = parseInt(maxYear as string);
        }
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice as string);
            if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
        }
        if (condition) where.condition = condition;
        if (search) {
            where.OR = [
                { make: { contains: search as string, mode: 'insensitive' } },
                { model: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } },
            ];
        }

        const total = await prisma.vehicle.count({ where });

        const vehicles = await prisma.vehicle.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                _count: {
                    select: {
                        timelineEvents: true,
                    },
                },
            },
            orderBy: {
                [sortBy as string]: sortOrder,
            },
            skip,
            take: limitNum,
        });

        // Get unique viewer counts for all vehicles
        const vehicleIds = vehicles.map(v => v.id);
        const viewCounts = await prisma.vehicleView.groupBy({
            by: ['vehicleId'],
            where: {
                vehicleId: { in: vehicleIds },
            },
            _count: {
                userId: true,
            },
        });

        // Map view counts to vehicles
        const viewCountMap = new Map(
            viewCounts.map(vc => [vc.vehicleId, vc._count.userId])
        );

        const vehiclesWithViewers = vehicles.map(vehicle => ({
            ...vehicle,
            uniqueViewers: viewCountMap.get(vehicle.id) || 0,
        }));

        res.json({
            vehicles: vehiclesWithViewers,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        console.error('Get vehicles error:', error);
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
};

export const getVehicleById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const vehicle = await prisma.vehicle.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        email: true,
                        phone: true,
                        createdAt: true,
                    },
                },
                timelineEvents: {
                    orderBy: {
                        date: 'asc',
                    },
                },
            },
        });

        if (!vehicle) {
            res.status(404).json({ error: 'Vehicle not found' });
            return;
        }

        // Track unique viewer (only if authenticated and not the owner)
        if (userId && userId !== vehicle.userId) {
            console.log(`🔍 Tracking view: User ${userId} viewing vehicle ${id}`);
            try {
                await prisma.vehicleView.upsert({
                    where: {
                        userId_vehicleId: {
                            userId,
                            vehicleId: id,
                        },
                    },
                    create: {
                        userId,
                        vehicleId: id,
                    },
                    update: {
                        viewedAt: new Date(),
                    },
                });
                console.log(`✅ View tracked successfully`);
            } catch (viewError) {
                console.error('❌ Error tracking view:', viewError);
            }
        } else {
            console.log(`⏭️  Skipping view tracking: ${!userId ? 'Not authenticated' : 'Owner viewing own vehicle'}`);
        }

        // Count unique viewers
        const uniqueViewerCount = await prisma.vehicleView.count({
            where: { vehicleId: id },
        });
        console.log(`📊 Vehicle ${id} has ${uniqueViewerCount} unique viewers`);

        res.json({
            ...vehicle,
            uniqueViewers: uniqueViewerCount,
        });
    } catch (error) {
        console.error('Get vehicle error:', error);
        res.status(500).json({ error: 'Failed to fetch vehicle' });
    }
};

export const createVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const vehicleData = req.body;

        const vehicle = await prisma.vehicle.create({
            data: {
                ...vehicleData,
                userId,
                price: parseFloat(vehicleData.price),
                purchaseDate: new Date(vehicleData.purchaseDate),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        res.status(201).json(vehicle);
    } catch (error) {
        console.error('Create vehicle error:', error);
        res.status(500).json({ error: 'Failed to create vehicle' });
    }
};

export const updateVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;
        const updateData = req.body;

        const existingVehicle = await prisma.vehicle.findUnique({
            where: { id },
        });

        if (!existingVehicle) {
            res.status(404).json({ error: 'Vehicle not found' });
            return;
        }

        if (existingVehicle.userId !== userId && req.user!.role !== 'ADMIN') {
            res.status(403).json({ error: 'Not authorized to update this vehicle' });
            return;
        }

        const vehicle = await prisma.vehicle.update({
            where: { id },
            data: {
                ...updateData,
                ...(updateData.price && { price: parseFloat(updateData.price) }),
                ...(updateData.purchaseDate && { purchaseDate: new Date(updateData.purchaseDate) }),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        res.json(vehicle);
    } catch (error) {
        console.error('Update vehicle error:', error);
        res.status(500).json({ error: 'Failed to update vehicle' });
    }
};

export const deleteVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;

        const vehicle = await prisma.vehicle.findUnique({
            where: { id },
        });

        if (!vehicle) {
            res.status(404).json({ error: 'Vehicle not found' });
            return;
        }

        if (vehicle.userId !== userId && req.user!.role !== 'ADMIN') {
            res.status(403).json({ error: 'Not authorized to delete this vehicle' });
            return;
        }

        await prisma.vehicle.delete({
            where: { id },
        });

        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Delete vehicle error:', error);
        res.status(500).json({ error: 'Failed to delete vehicle' });
    }
};

export const uploadVehicleImages = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            res.status(400).json({ error: 'No files uploaded' });
            return;
        }

        const imageUrls = files.map((file) => uploadToLocalStorage(file));
        const resolvedUrls = await Promise.all(imageUrls);

        res.json({ imageUrls: resolvedUrls });
    } catch (error) {
        console.error('Upload images error:', error);
        res.status(500).json({ error: 'Failed to upload images' });
    }
};

export const getMyVehicles = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;

        const vehicles = await prisma.vehicle.findMany({
            where: { userId },
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

        // Get unique viewer counts for user's vehicles
        const vehicleIds = vehicles.map(v => v.id);
        const viewCounts = await prisma.vehicleView.groupBy({
            by: ['vehicleId'],
            where: {
                vehicleId: { in: vehicleIds },
            },
            _count: {
                userId: true,
            },
        });

        // Map view counts to vehicles
        const viewCountMap = new Map(
            viewCounts.map((vc: any) => [vc.vehicleId, vc._count.userId])
        );

        const vehiclesWithViewers = vehicles.map(vehicle => ({
            ...vehicle,
            uniqueViewers: viewCountMap.get(vehicle.id) || 0,
        }));

        res.json(vehiclesWithViewers);
    } catch (error) {
        console.error('Get my vehicles error:', error);
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
};
