import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config }  from "../config/env";

interface JwtPayload {
    userId: number;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authenticationToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;

    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
        req.user = decoded;
        console.log("Token verified:", decoded);
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: 'Token expired' });
            return;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}