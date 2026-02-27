import jwt from 'jsonwebtoken';
import { ConfigManager } from '../config/ConfigManager.js';
import { User } from '../domain/User.js';
import type { IUserRepository } from '../repositories/UserRepository.js';
import { Logger } from '../utils/Logger.js';

export class AuthService {
    private config: ConfigManager;
    private userRepository: IUserRepository;
    private logger: Logger;

    constructor(userRepository: IUserRepository) {
        this.config = ConfigManager.getInstance();
        this.userRepository = userRepository;
        this.logger = Logger.getInstance();
    }

    public generateToken(user: User): string {
        const payload = {
            id: user.getId(),
            email: user.getEmail(),
        };
        const secret = this.config.get('JWT_SECRET');
        return jwt.sign(payload, secret, { expiresIn: '1h' });
    }

    public verifyToken(token: string): any {
        try {
            const secret = this.config.get('JWT_SECRET');
            return jwt.verify(token, secret);
        } catch (error) {
            this.logger.error('Token verification failed', error);
            return null;
        }
    }
}
