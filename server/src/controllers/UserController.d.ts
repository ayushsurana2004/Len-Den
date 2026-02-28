import type { Request, Response } from 'express';
import type { IUserRepository } from '../repositories/UserRepository.js';
import type { AuthService } from '../services/AuthService.js';
import type { IGroupRepository } from '../repositories/GroupRepository.js';
export declare class UserController {
    private userRepository;
    private authService;
    private groupRepository;
    constructor(userRepository: IUserRepository, authService: AuthService, groupRepository: IGroupRepository);
    register: (req: Request, res: Response) => Promise<void>;
    login: (req: Request, res: Response) => Promise<void>;
    private normalizeMobile;
    searchUser: (req: Request, res: Response) => Promise<void>;
    getFriends: (req: Request, res: Response) => Promise<void>;
    inviteFriend: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=UserController.d.ts.map