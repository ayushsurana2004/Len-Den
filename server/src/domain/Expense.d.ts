export declare abstract class BaseExpense {
    protected id?: number | undefined;
    protected description: string;
    protected amount: number;
    protected payerId: number;
    protected groupId?: number | undefined;
    protected createdAt: Date;
    constructor(description: string, amount: number, payerId: number, groupId?: number, id?: number);
    abstract calculateSplits(userIds: number[]): {
        userId: number;
        amount: number;
    }[];
    getId(): number | undefined;
    getAmount(): number;
    getPayerId(): number;
    getDescription(): string;
    getGroupId(): number | undefined;
    getCreatedAt(): Date;
}
import type { SplitStrategy } from './SplitStrategy.js';
export declare class Expense extends BaseExpense {
    private strategy;
    constructor(description: string, amount: number, payerId: number, strategy: SplitStrategy, groupId?: number, id?: number);
    calculateSplits(userIds: number[], options?: any): {
        userId: number;
        amount: number;
    }[];
    getStrategy(): SplitStrategy;
    getSplitType(): string;
}
//# sourceMappingURL=Expense.d.ts.map