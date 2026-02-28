import type { Request, Response } from 'express';
import type { IGroupRepository } from '../repositories/GroupRepository.js';
import type { IUserRepository } from '../repositories/UserRepository.js';
export declare class GroupController {
    private groupRepository;
    private userRepository;
    constructor(groupRepository: IGroupRepository, userRepository: IUserRepository);
    createGroup: (req: Request, res: Response) => Promise<void>;
    getUserGroups: (req: Request, res: Response) => Promise<void>;
    getGroupMembers: (req: Request, res: Response) => Promise<void>;
    addMember: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=GroupController.d.ts.map