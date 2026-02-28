import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService.js';
export declare class AuthMiddleware {
    private authService;
    constructor(authService: AuthService);
    handle: (req: Request, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=AuthMiddleware.d.ts.map