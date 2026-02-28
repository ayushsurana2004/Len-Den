export declare class SettlementService {
    private db;
    private groupService;
    constructor();
    initiateSettlement(payerId: number, payeeId: number, amount: number): Promise<{
        id: number;
        key: string;
    }>;
    getBalanceSummary(userId: number, groupId?: number | null): Promise<{
        totalBalance: number;
        youOwe: number;
        youAreOwed: number;
    }>;
    confirmSettlement(settlementId: number, key: string): Promise<{
        success: boolean;
        newKey: string;
    }>;
    getSimplifiedDebts(groupId: number): Promise<{
        from: any;
        to: any;
        amount: number;
    }[]>;
}
//# sourceMappingURL=SettlementService.d.ts.map