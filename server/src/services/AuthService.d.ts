import { User } from '../domain/User.js';
import type { IUserRepository } from '../repositories/UserRepository.js';
export declare class AuthService {
    private userRepository;
    private logger;
    constructor(userRepository: IUserRepository);
    generateToken(user: User): string;
    verifyToken(token: string): any;
}
//# sourceMappingURL=AuthService.d.ts.map