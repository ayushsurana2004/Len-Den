export class BaseExpense {
    id;
    description;
    amount;
    payerId;
    groupId;
    createdAt;
    constructor(description, amount, payerId, groupId, id) {
        this.description = description;
        this.amount = amount;
        this.payerId = payerId;
        this.groupId = groupId;
        this.id = id;
        this.createdAt = new Date();
    }
    getId() {
        return this.id;
    }
    getAmount() {
        return this.amount;
    }
    getPayerId() {
        return this.payerId;
    }
    getDescription() {
        return this.description;
    }
    getGroupId() {
        return this.groupId;
    }
    getCreatedAt() {
        return this.createdAt;
    }
}
export class Expense extends BaseExpense {
    strategy;
    constructor(description, amount, payerId, strategy, groupId, id) {
        super(description, amount, payerId, groupId, id);
        this.strategy = strategy;
    }
    calculateSplits(userIds, options) {
        return this.strategy.calculateSplits(this.amount, userIds, options);
    }
    getStrategy() {
        return this.strategy;
    }
    getSplitType() {
        return this.strategy.getType();
    }
}
//# sourceMappingURL=Expense.js.map