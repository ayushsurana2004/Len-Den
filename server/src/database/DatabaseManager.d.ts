export declare class DatabaseManager {
    private static instance;
    private pool;
    private logger;
    private constructor();
    static getInstance(): DatabaseManager;
    query(text: string, params?: any[]): Promise<import("pg").QueryResult<any>>;
    getClient(): Promise<import("pg").PoolClient>;
}
//# sourceMappingURL=DatabaseManager.d.ts.map