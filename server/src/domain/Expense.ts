export abstract class BaseExpense {
    protected id?: number | undefined;
    protected description: string;
    protected amount: number;
    protected payerId: number;
    protected groupId?: number | undefined;
    protected createdAt: Date;

    constructor(description: string, amount: number, payerId: number, groupId?: number, id?: number) {
        this.description = description;
        this.amount = amount;
        this.payerId = payerId;
        this.groupId = groupId;
        this.id = id;
        this.createdAt = new Date();
    }

    public abstract calculateSplits(userIds: number[]): { userId: number, amount: number }[];

    public getId(): number | undefined {
        return this.id;
    }

    public getAmount(): number {
        return this.amount;
    }

    public getPayerId(): number {
        return this.payerId;
    }

    public getDescription(): string {
        return this.description;
    }

    public getGroupId(): number | undefined {
        return this.groupId;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }
}

import type { SplitStrategy } from './SplitStrategy.js';

export class Expense extends BaseExpense {
    private strategy: SplitStrategy;

    constructor(
        description: string,
        amount: number,
        payerId: number,
        strategy: SplitStrategy,
        groupId?: number,
        id?: number
    ) {
        super(description, amount, payerId, groupId, id);
        this.strategy = strategy;
    }

    public calculateSplits(userIds: number[], options?: any): { userId: number, amount: number }[] {
        return this.strategy.calculateSplits(this.amount, userIds, options);
    }

    public getStrategy(): SplitStrategy {
        return this.strategy;
    }

    public getSplitType(): string {
        return this.strategy.getType();
    }
}
