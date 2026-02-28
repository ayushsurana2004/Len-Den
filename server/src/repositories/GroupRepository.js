import { Group } from '../domain/Group.js';
import { DatabaseManager } from '../database/DatabaseManager.js';
import crypto from 'crypto';
export class PostgresGroupRepository {
    db;
    constructor() {
        this.db = DatabaseManager.getInstance();
    }
    async create(name, createdById) {
        const result = await this.db.query('INSERT INTO groups (name, created_by) VALUES ($1, $2) RETURNING *', [name, createdById]);
        const row = result.rows[0];
        // Automatically add the creator as a member
        await this.addMember(row.id, createdById);
        return new Group(row.name, row.id);
    }
    async addMember(groupId, userId) {
        const settlementKey = crypto.randomBytes(3).toString('hex');
        await this.db.query('INSERT INTO user_groups (group_id, user_id, settlement_key) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [groupId, userId, settlementKey]);
    }
    async findByUserId(userId) {
        const result = await this.db.query(`SELECT g.* FROM groups g 
             JOIN user_groups ug ON g.id = ug.group_id 
             WHERE ug.user_id = $1`, [userId]);
        return result.rows.map(row => new Group(row.name, row.id));
    }
    async findById(id) {
        const result = await this.db.query('SELECT * FROM groups WHERE id = $1', [id]);
        if (result.rows.length === 0)
            return null;
        const row = result.rows[0];
        return new Group(row.name, row.id);
    }
    async getMembers(groupId) {
        const result = await this.db.query(`SELECT u.id, u.name, u.email, u.mobile_number, ug.settlement_key 
             FROM users u
             JOIN user_groups ug ON u.id = ug.user_id
             WHERE ug.group_id = $1`, [groupId]);
        return result.rows;
    }
    async createPendingInvitation(groupId, mobileNumber, invitedBy) {
        await this.db.query('INSERT INTO pending_invitations (group_id, mobile_number, invited_by) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [groupId, mobileNumber, invitedBy]);
    }
    async getPendingInvitations(mobileNumber) {
        const result = await this.db.query('SELECT * FROM pending_invitations WHERE mobile_number = $1', [mobileNumber]);
        return result.rows;
    }
    async deletePendingInvitations(mobileNumber) {
        await this.db.query('DELETE FROM pending_invitations WHERE mobile_number = $1', [mobileNumber]);
    }
}
//# sourceMappingURL=GroupRepository.js.map