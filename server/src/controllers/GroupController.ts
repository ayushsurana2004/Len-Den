import type { Request, Response } from 'express';
import type { IGroupRepository } from '../repositories/GroupRepository.js';
import type { IUserRepository } from '../repositories/UserRepository.js';

export class GroupController {
    constructor(
        private groupRepository: IGroupRepository,
        private userRepository: IUserRepository
    ) { }

    public createGroup = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name } = req.body;
            const userId = (req as any).user.id;
            const group = await this.groupRepository.create(name, userId);
            res.status(201).json(group);
        } catch (error) {
            res.status(500).json({ message: 'Error creating group', error: (error as Error).message });
        }
    };

    public getUserGroups = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const groups = await this.groupRepository.findByUserId(userId);
            res.json(groups);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching groups', error: (error as Error).message });
        }
    };

    public getGroupMembers = async (req: Request, res: Response): Promise<void> => {
        try {
            const groupId = parseInt(req.params.groupId as string);
            if (isNaN(groupId)) {
                res.status(400).json({ message: 'Invalid groupId' });
                return;
            }
            const members = await this.groupRepository.getMembers(groupId);
            res.json(members);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching group members', error: (error as Error).message });
        }
    };

    public addMember = async (req: Request, res: Response): Promise<void> => {
        try {
            const { mobileNumber } = req.body;
            const groupId = Number(req.body.groupId);
            const userId = req.body.userId ? Number(req.body.userId) : undefined;
            const inviterId = Number((req as any).user.id);

            // 1. Fetch group and inviter first (mandatory)
            const [group, inviter] = await Promise.all([
                this.groupRepository.findById(groupId),
                this.userRepository.findById(inviterId)
            ]);

            if (!group || !inviter) {
                res.status(404).json({ message: 'Group or Inviter not found' });
                return;
            }

            // 2. Scenario A: Adding an existing user
            if (userId) {
                const user = await this.userRepository.findById(userId);
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }

                await this.groupRepository.addMember(groupId, userId);
                res.json({ message: 'Member added successfully' });
                return;
            }

            // 3. Scenario B: Inviting a non-existent user by mobile
            if (mobileNumber) {
                // Check if user actually exists first (in case client sent mobile instead of id)
                const existingUser = await this.userRepository.findByMobile(mobileNumber);
                if (existingUser) {
                    const uid = existingUser.getId();
                    if (uid) {
                        await this.groupRepository.addMember(groupId, uid);
                        res.json({ message: 'Member added successfully' });
                        return;
                    }
                }

                // If truly doesn't exist, create pending invitation
                await this.groupRepository.createPendingInvitation(groupId, mobileNumber, inviterId);
                res.json({ message: 'Invitation saved! User will be added when they register.' });
                return;
            }

            res.status(400).json({ message: 'Either userId or mobileNumber is required' });
        } catch (error) {
            res.status(500).json({ message: 'Error adding member', error: (error as Error).message });
        }
    };
}
