import { User } from '../domain/User.js';
export interface IUserRepository {
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByMobile(mobile: string): Promise<User | null>;
    save(user: User): Promise<User>;
    getFriends(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        mobileNumber: string;
    }[]>;
}
export declare class PostgresUserRepository implements IUserRepository {
    private db;
    constructor();
    private rowToUser;
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByMobile(mobile: string): Promise<User | null>;
    save(user: User): Promise<User>;
    getFriends(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        mobileNumber: string;
        balance: number;
    }[]>;
}
//# sourceMappingURL=UserRepository.d.ts.map