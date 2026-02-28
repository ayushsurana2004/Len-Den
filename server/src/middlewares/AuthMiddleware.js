import { AuthService } from '../services/AuthService.js';
export class AuthMiddleware {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    handle = (req, res, next) => {
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
        req.user = decoded;
        next();
    };
}
//# sourceMappingURL=AuthMiddleware.js.map