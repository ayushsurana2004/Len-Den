import { Expense } from './Expense.js';
import { EqualSplitStrategy, ExactSplitStrategy, PercentSplitStrategy } from './SplitStrategy.js';

export enum SplitType {
    EQUAL = 'EQUAL',
    EXACT = 'EXACT',
    PERCENT = 'PERCENT'
}

export class ExpenseFactory {
    public static createExpense(
        type: SplitType,
        description: string,
        amount: number,
        payerId: number,
        groupId?: number
    ): Expense {
        let strategy;
        switch (type) {
            case SplitType.EQUAL:
                strategy = new EqualSplitStrategy();
                break;
            case SplitType.EXACT:
                strategy = new ExactSplitStrategy();
                break;
            case SplitType.PERCENT:
                strategy = new PercentSplitStrategy();
                break;
            default:
                throw new Error("Invalid split type");
        }
        return new Expense(description, amount, payerId, strategy, groupId);
    }
}
