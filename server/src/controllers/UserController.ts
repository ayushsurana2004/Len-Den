import type { Request, Response } from 'express';
import type { IUserRepository } from '../repositories/UserRepository.js';
import type { AuthService } from '../services/AuthService.js';
import { User } from '../domain/User.js';
import type { IGroupRepository } from '../repositories/GroupRepository.js';

export class UserController {
    constructor(
        private userRepository: IUserRepository,
        private authService: AuthService,
        private groupRepository: IGroupRepository
    ) { }

    public register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, mobileNumber, password } = req.body;

            if (!email || !mobileNumber) {
                res.status(400).json({ message: 'Email and Mobile number are required' });
                return;
            }

            const existingEmail = await this.userRepository.findByEmail(email);
            if (existingEmail) {
                res.status(400).json({ message: 'User with this email already exists' });
                return;
            }

            const existingMobile = await this.userRepository.findByMobile(mobileNumber);
            if (existingMobile) {
                res.status(400).json({ message: 'User with this mobile number already exists' });
                return;
            }

            const user = await User.create(name, password, email, mobileNumber);
            if (!user.validate()) {
                res.status(400).json({ message: 'Invalid user data provided' });
                return;
            }

            const savedUser = await this.userRepository.save(user);
            const token = this.authService.generateToken(savedUser);

            // Fulfill pending invitations
            const pendingInvites = await this.groupRepository.getPendingInvitations(mobileNumber);
            for (const invite of pendingInvites) {
                await this.groupRepository.addMember(invite.group_id, savedUser.getId()!);
            }
            if (pendingInvites.length > 0) {
                await this.groupRepository.deletePendingInvitations(mobileNumber);
            }

            res.status(201).json({
                token,
                user: {
                    id: savedUser.getId(),
                    name: savedUser.getName(),
                    email: savedUser.getEmail(),
                    mobileNumber: savedUser.getMobileNumber(),
                    fulfilledInvites: pendingInvites.length
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error registering user', error: (error as Error).message });
        }
    };

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            let { email, mobileNumber, password } = req.body;
            let user: User | null = null;

            if (email) {
                user = await this.userRepository.findByEmail(email);
            } else if (mobileNumber) {
                mobileNumber = this.normalizeMobile(mobileNumber);
                user = await this.userRepository.findByMobile(mobileNumber);
            }

            if (!user || !(await user.comparePassword(password))) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }

            const token = this.authService.generateToken(user);
            res.json({
                token,
                user: {
                    id: user.getId(),
                    name: user.getName(),
                    email: user.getEmail(),
                    mobileNumber: user.getMobileNumber()
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error: (error as Error).message });
        }
    };

    private normalizeMobile(mobile: string): string {
        const digitsOnly = mobile.replace(/\D/g, '');
        if (digitsOnly.length === 10) {
            return `+91${digitsOnly}`;
        }
        return mobile.startsWith('+') ? mobile : `+${mobile}`;
    }

    public searchUser = async (req: Request, res: Response): Promise<void> => {
        try {
            let { query } = req.query;
            if (!query || typeof query !== 'string') {
                res.status(400).json({ message: 'Search query is required' });
                return;
            }

            let user: User | null = null;
            if (query.includes('@')) {
                user = await this.userRepository.findByEmail(query);
            } else {
                query = this.normalizeMobile(query);
                user = await this.userRepository.findByMobile(query);
            }

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.json({
                id: user.getId(),
                name: user.getName(),
                email: user.getEmail(),
                mobileNumber: user.getMobileNumber()
            });
        } catch (error) {
            res.status(500).json({ message: 'Error searching user', error: (error as Error).message });
        }
    };

    public getFriends = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const friends = await this.userRepository.getFriends(userId);
            res.json(friends);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching friends', error: (error as Error).message });
        }
    };

    public inviteFriend = async (req: Request, res: Response): Promise<void> => {
        try {
            let { query } = req.body;
            if (!query || typeof query !== 'string') {
                res.status(400).json({ message: 'Email or phone number is required' });
                return;
            }

            let user: User | null = null;
            if (query.includes('@')) {
                user = await this.userRepository.findByEmail(query);
            } else {
                query = this.normalizeMobile(query);
                user = await this.userRepository.findByMobile(query);
            }

            if (!user) {
                res.status(404).json({ message: 'User not on Daily Udhari yet.' });
                return;
            }

            res.json({
                id: user.getId(),
                name: user.getName(),
                email: user.getEmail(),
                mobileNumber: user.getMobileNumber()
            });
        } catch (error) {
            res.status(500).json({ message: 'Error inviting friend', error: (error as Error).message });
        }
    };
}
