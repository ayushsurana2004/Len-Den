import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../domain/User.js';
import { Logger } from '../utils/Logger.js';
export class AuthService {
    userRepository;
    logger;
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = Logger.getInstance();
    }
    generateToken(user) {
        const payload = {
            id: user.getId(),
            email: user.getEmail(),
        };
        const secret = env.JWT_SECRET;
        return jwt.sign(payload, secret, { expiresIn: '1h' });
    }
    verifyToken(token) {
        try {
            const secret = env.JWT_SECRET;
            return jwt.verify(token, secret);
        }
        catch (error) {
            this.logger.error('Token verification failed', error);
            return null;
        }
    }
}
//# sourceMappingURL=AuthService.js.map