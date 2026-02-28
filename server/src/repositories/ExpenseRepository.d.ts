import { Expense } from '../domain/Expense.js';
export interface IExpenseRepository {
    save(expense: Expense, splits: {
        userId: number;
        amount: number;
    }[]): Promise<void>;
    findByGroupId(groupId: number): Promise<Expense[]>;
    findByUserId(userId: number, groupId?: number | null): Promise<any[]>;
}
export declare class PostgresExpenseRepository implements IExpenseRepository {
    private db;
    constructor();
    save(expense: Expense, splits: {
        userId: number;
        amount: number;
    }[]): Promise<void>;
    findByGroupId(groupId: number): Promise<Expense[]>;
    findByUserId(userId: number, groupId?: number | null): Promise<any[]>;
}
//# sourceMappingURL=ExpenseRepository.d.ts.map