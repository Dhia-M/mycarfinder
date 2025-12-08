import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', err);

    // Prisma errors
    if (err.code === 'P2002') {
        res.status(409).json({
            error: 'A record with this unique field already exists',
            field: err.meta?.target,
        });
        return;
    }

    if (err.code === 'P2025') {
        res.status(404).json({ error: 'Record not found' });
        return;
    }

    // Zod validation errors
    if (err.name === 'ZodError') {
        res.status(400).json({
            error: 'Validation error',
            details: err.errors,
        });
        return;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }

    if (err.name === 'TokenExpiredError') {
        res.status(401).json({ error: 'Token expired' });
        return;
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
