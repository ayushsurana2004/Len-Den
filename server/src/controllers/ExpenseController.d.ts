import type { Request, Response } from 'express';
import type { IExpenseRepository } from '../repositories/ExpenseRepository.js';
import type { IGroupRepository } from '../repositories/GroupRepository.js';
export declare class ExpenseController {
    private expenseRepository;
    private groupRepository;
    constructor(expenseRepository: IExpenseRepository, groupRepository: IGroupRepository);
    addExpense: (req: Request, res: Response) => Promise<void>;
    getExpenses: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=ExpenseController.d.ts.map