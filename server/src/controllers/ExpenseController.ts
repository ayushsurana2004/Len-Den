import type { Request, Response } from 'express';
import type { IExpenseRepository } from '../repositories/ExpenseRepository.js';
import type { IGroupRepository } from '../repositories/GroupRepository.js';
import { ExpenseFactory, SplitType } from '../domain/ExpenseFactory.js';

export class ExpenseController {
    constructor(
        private expenseRepository: IExpenseRepository,
        private groupRepository: IGroupRepository
    ) { }

    public addExpense = async (req: Request, res: Response): Promise<void> => {
        try {
            let { description, amount, splitType, userIds, groupId, options } = req.body;
            const payerId = (req as any).user.id;

            // If userIds is empty but groupId is provided, fetch all group members
            if ((!userIds || userIds.length === 0) && groupId) {
                const members = await this.groupRepository.getMembers(parseInt(groupId as string));
                userIds = members.map(m => m.id);
            }

            // Fallback if still empty (split with self)
            if (!userIds || userIds.length === 0) {
                userIds = [payerId];
            }

            const expense = ExpenseFactory.createExpense(
                splitType as SplitType,
                description,
                parseFloat(amount as string),
                payerId,
                groupId ? parseInt(groupId as string) : undefined
            );

            const splits = expense.calculateSplits(userIds, options);
            await this.expenseRepository.save(expense, splits);

            res.status(201).json({ message: 'Expense added successfully', splits });
        } catch (error) {
            res.status(500).json({ message: 'Error adding expense', error: (error as Error).message });
        }
    };

    public getExpenses = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id;
            const groupId = req.query.groupId ? parseInt(req.query.groupId as string) : null;
            const expenses = await this.expenseRepository.findByUserId(userId, groupId);
            res.json(expenses);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching expenses', error: (error as Error).message });
        }
    };
}
