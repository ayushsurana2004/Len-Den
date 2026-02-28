import { Group } from '../domain/Group.js';
export interface IGroupRepository {
    create(name: string, createdById: number): Promise<Group>;
    addMember(groupId: number, userId: number): Promise<void>;
    findByUserId(userId: number): Promise<Group[]>;
    findById(id: number): Promise<Group | null>;
    getMembers(groupId: number): Promise<any[]>;
    createPendingInvitation(groupId: number, mobileNumber: string, invitedBy: number): Promise<void>;
    getPendingInvitations(mobileNumber: string): Promise<any[]>;
    deletePendingInvitations(mobileNumber: string): Promise<void>;
}
export declare class PostgresGroupRepository implements IGroupRepository {
    private db;
    constructor();
    create(name: string, createdById: number): Promise<Group>;
    addMember(groupId: number, userId: number): Promise<void>;
    findByUserId(userId: number): Promise<Group[]>;
    findById(id: number): Promise<Group | null>;
    getMembers(groupId: number): Promise<any[]>;
    createPendingInvitation(groupId: number, mobileNumber: string, invitedBy: number): Promise<void>;
    getPendingInvitations(mobileNumber: string): Promise<any[]>;
    deletePendingInvitations(mobileNumber: string): Promise<void>;
}
//# sourceMappingURL=GroupRepository.d.ts.map