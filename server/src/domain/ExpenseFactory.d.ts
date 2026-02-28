import { Expense } from './Expense.js';
export declare enum SplitType {
    EQUAL = "EQUAL",
    EXACT = "EXACT",
    PERCENT = "PERCENT"
}
export declare class ExpenseFactory {
    static createExpense(type: SplitType, description: string, amount: number, payerId: number, groupId?: number): Expense;
}
//# sourceMappingURL=ExpenseFactory.d.ts.map