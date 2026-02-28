export interface SettlementState {
    generateKey(): void;
    confirmSettlement(key: string): void;
    getStatus(): string;
}
export declare class PendingState implements SettlementState {
    private context;
    constructor(context: SettlementContext);
    generateKey(): void;
    confirmSettlement(key: string): void;
    getStatus(): string;
}
export declare class KeyGeneratedState implements SettlementState {
    private context;
    constructor(context: SettlementContext);
    generateKey(): void;
    confirmSettlement(key: string): void;
    getStatus(): string;
}
export declare class SettledState implements SettlementState {
    private context;
    constructor(context: SettlementContext);
    generateKey(): void;
    confirmSettlement(key: string): void;
    getStatus(): string;
}
export declare class SettlementContext {
    private state;
    private settlementId;
    private settlementKey;
    constructor(settlementId: number);
    setState(state: SettlementState): void;
    setKey(key: string): void;
    getKey(): string | null;
    getSettlementId(): number;
    generateKey(): void;
    confirmSettlement(key: string): void;
    getStatus(): string;
}
//# sourceMappingURL=SettlementState.d.ts.map