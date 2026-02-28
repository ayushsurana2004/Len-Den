import { ExpenseFactory, SplitType } from '../domain/ExpenseFactory.js';
export class ExpenseController {
    expenseRepository;
    groupRepository;
    constructor(expenseRepository, groupRepository) {
        this.expenseRepository = expenseRepository;
        this.groupRepository = groupRepository;
    }
    addExpense = async (req, res) => {
        try {
            let { description, amount, splitType, userIds, groupId, options } = req.body;
            const payerId = Number(req.user.id);
            const numericGroupId = groupId ? Number(groupId) : undefined;
            // If userIds is empty but groupId is provided, fetch all group members
            if ((!userIds || userIds.length === 0) && numericGroupId) {
                const members = await this.groupRepository.getMembers(numericGroupId);
                if (members.length === 0) {
                    res.status(400).json({ message: 'Cannot add expense to a group with no members.' });
                    return;
                }
                userIds = members.map(m => m.id);
            }
            // Fallback if still empty (split with self)
            if (!userIds || userIds.length === 0) {
                userIds = [payerId];
            }
            const expense = ExpenseFactory.createExpense(splitType, description, parseFloat(amount), payerId, numericGroupId);
            const splits = expense.calculateSplits(userIds, options);
            await this.expenseRepository.save(expense, splits);
            res.status(201).json({ message: 'Expense added successfully', splits });
        }
        catch (error) {
            res.status(500).json({ message: 'Error adding expense', error: error.message });
        }
    };
    getExpenses = async (req, res) => {
        try {
            const userId = req.user.id;
            const groupId = req.query.groupId ? parseInt(req.query.groupId) : null;
            const expenses = await this.expenseRepository.findByUserId(userId, groupId);
            res.json(expenses);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching expenses', error: error.message });
        }
    };
}
//# sourceMappingURL=ExpenseController.js.map