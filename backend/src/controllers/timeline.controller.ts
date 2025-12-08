import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToCloudinary } from '../config/cloudinary.config';

export const createTimelineEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { vehicleId } = req.params;
        const userId = req.user!.userId;
        const eventData = req.body;

        // Check if vehicle exists and user is the owner
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId },
        });

        if (!vehicle) {
            res.status(404).json({ error: 'Vehicle not found' });
            return;
        }

        if (vehicle.userId !== userId && req.user!.role !== 'ADMIN') {
            res.status(403).json({ error: 'Not authorized to add events to this vehicle' });
            return;
        }

        // Create timeline event
        const timelineEvent = await prisma.timelineEvent.create({
            data: {
                vehicleId,
                ...eventData,
                date: new Date(eventData.date),
                ...(eventData.cost && { cost: parseFloat(eventData.cost) }),
            },
        });

        res.status(201).json(timelineEvent);
    } catch (error) {
        console.error('Create timeline event error:', error);
        res.status(500).json({ error: 'Failed to create timeline event' });
    }
};

export const updateTimelineEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { vehicleId, eventId } = req.params;
        const userId = req.user!.userId;
        const updateData = req.body;

        // Check if vehicle exists and user is the owner
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId },
        });

        if (!vehicle) {
            res.status(404).json({ error: 'Vehicle not found' });
            return;
        }

        if (vehicle.userId !== userId && req.user!.role !== 'ADMIN') {
            res.status(403).json({ error: 'Not authorized to update events for this vehicle' });
            return;
        }

        // Update timeline event
        const timelineEvent = await prisma.timelineEvent.update({
            where: { id: eventId },
            data: {
                ...updateData,
                ...(updateData.date && { date: new Date(updateData.date) }),
                ...(updateData.cost && { cost: parseFloat(updateData.cost) }),
            },
        });

        res.json(timelineEvent);
    } catch (error) {
        console.error('Update timeline event error:', error);
        res.status(500).json({ error: 'Failed to update timeline event' });
    }
};

export const deleteTimelineEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { vehicleId, eventId } = req.params;
        const userId = req.user!.userId;

        // Check if vehicle exists and user is the owner
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId },
        });

        if (!vehicle) {
            res.status(404).json({ error: 'Vehicle not found' });
            return;
        }

        if (vehicle.userId !== userId && req.user!.role !== 'ADMIN') {
            res.status(403).json({ error: 'Not authorized to delete events from this vehicle' });
            return;
        }

        await prisma.timelineEvent.delete({
            where: { id: eventId },
        });

        res.json({ message: 'Timeline event deleted successfully' });
    } catch (error) {
        console.error('Delete timeline event error:', error);
        res.status(500).json({ error: 'Failed to delete timeline event' });
    }
};

export const uploadEventImage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const file = req.file;

        if (!file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const imageUrl = await uploadToCloudinary(file);

        res.json({ imageUrl });
    } catch (error) {
        console.error('Upload event image error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
};
