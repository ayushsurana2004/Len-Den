export interface SplitStrategy {
    calculateSplits(amount: number, userIds: number[], options?: any): {
        userId: number;
        amount: number;
    }[];
    getType(): string;
}
export declare class EqualSplitStrategy implements SplitStrategy {
    calculateSplits(amount: number, userIds: number[]): {
        userId: number;
        amount: number;
    }[];
    getType(): string;
}
export declare class ExactSplitStrategy implements SplitStrategy {
    calculateSplits(amount: number, userIds: number[], options: {
        amounts: number[];
    }): {
        userId: number;
        amount: number;
    }[];
    getType(): string;
}
export declare class PercentSplitStrategy implements SplitStrategy {
    calculateSplits(amount: number, userIds: number[], options: {
        percentages: number[];
    }): {
        userId: number;
        amount: number;
    }[];
    getType(): string;
}
//# sourceMappingURL=SplitStrategy.d.ts.map