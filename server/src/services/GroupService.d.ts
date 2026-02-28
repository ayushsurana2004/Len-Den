export declare class GroupService {
    private db;
    private logger;
    constructor();
    /**
     * Rotates the settlement key for a specific member in a specific group.
     * Generates a new random 6-character hex key and updates the user_groups table.
     * Can optionally accept a DB client for transaction support.
     */
    rotateMemberKey(groupId: number, userId: number, client?: any): Promise<string>;
}
//# sourceMappingURL=GroupService.d.ts.map