export class EqualSplitStrategy {
    calculateSplits(amount, userIds) {
        if (userIds.length === 0)
            return [];
        const splitAmount = parseFloat((amount / userIds.length).toFixed(2));
        const splits = userIds.map(userId => ({ userId, amount: splitAmount }));
        const totalSplit = splits.reduce((sum, s) => sum + s.amount, 0);
        if (totalSplit !== amount && splits.length > 0) {
            const diff = parseFloat((amount - totalSplit).toFixed(2));
            // Non-null assertion as we check splits.length > 0
            splits[0].amount = parseFloat((splits[0].amount + diff).toFixed(2));
        }
        return splits;
    }
    getType() {
        return 'EQUAL';
    }
}
export class ExactSplitStrategy {
    calculateSplits(amount, userIds, options) {
        if (!options || !options.amounts || options.amounts.length !== userIds.length) {
            throw new Error("Invalid split amounts provided");
        }
        if (parseFloat(options.amounts.reduce((sum, a) => sum + a, 0).toFixed(2)) !== amount) {
            throw new Error("Split amounts do not sum up to total amount");
        }
        return userIds.map((userId, index) => ({
            userId,
            amount: options.amounts[index] // Non-null assertion as we check length
        }));
    }
    getType() {
        return 'EXACT';
    }
}
export class PercentSplitStrategy {
    calculateSplits(amount, userIds, options) {
        if (!options || !options.percentages || options.percentages.length !== userIds.length) {
            throw new Error("Invalid split percentages provided");
        }
        if (options.percentages.reduce((sum, p) => sum + p, 0) !== 100) {
            throw new Error("Split percentages do not sum up to 100");
        }
        return userIds.map((userId, index) => ({
            userId,
            amount: parseFloat(((amount * options.percentages[index]) / 100).toFixed(2)) // Non-null assertion as we check length
        }));
    }
    getType() {
        return 'PERCENT';
    }
}
//# sourceMappingURL=SplitStrategy.js.map