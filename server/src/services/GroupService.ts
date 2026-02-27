import crypto from 'crypto';
import { DatabaseManager } from '../database/DatabaseManager.js';
import { Logger } from '../utils/Logger.js';

export class GroupService {
    private db: DatabaseManager;
    private logger: Logger;

    constructor() {
        this.db = DatabaseManager.getInstance();
        this.logger = Logger.getInstance();
    }

    /**
     * Rotates the settlement key for a specific member in a specific group.
     * Generates a new random 6-character hex key and updates the user_groups table.
     * Can optionally accept a DB client for transaction support.
     */
    public async rotateMemberKey(
        groupId: number,
        userId: number,
        client?: any
    ): Promise<string> {
        const newKey = crypto.randomBytes(3).toString('hex');
        const queryFn = client ? client.query.bind(client) : this.db.query.bind(this.db);

        await queryFn(
            'UPDATE user_groups SET settlement_key = $1 WHERE group_id = $2 AND user_id = $3',
            [newKey, groupId, userId]
        );

        this.logger.log(`Key rotated for user ${userId} in group ${groupId}: new key = ${newKey}`);
        return newKey;
    }
}
