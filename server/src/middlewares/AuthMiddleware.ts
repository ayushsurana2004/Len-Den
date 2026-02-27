import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService.js';

export class AuthMiddleware {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    public handle = (req: Request, res: Response, next: NextFunction): void => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Invalid token format' });
            return;
        }
        const decoded = this.authService.verifyToken(token);

        if (!decoded) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }

        (req as any).user = decoded;
        next();
    };
}
