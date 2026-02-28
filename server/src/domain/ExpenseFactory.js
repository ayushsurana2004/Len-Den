import { Expense } from './Expense.js';
import { EqualSplitStrategy, ExactSplitStrategy, PercentSplitStrategy } from './SplitStrategy.js';
export var SplitType;
(function (SplitType) {
    SplitType["EQUAL"] = "EQUAL";
    SplitType["EXACT"] = "EXACT";
    SplitType["PERCENT"] = "PERCENT";
})(SplitType || (SplitType = {}));
export class ExpenseFactory {
    static createExpense(type, description, amount, payerId, groupId) {
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
//# sourceMappingURL=ExpenseFactory.js.map