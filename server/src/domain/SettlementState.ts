import { Logger } from '../utils/Logger.js';

export interface SettlementState {
    generateKey(): void;
    confirmSettlement(key: string): void;
    getStatus(): string;
}

export class PendingState implements SettlementState {
    private context: SettlementContext;

    constructor(context: SettlementContext) {
        this.context = context;
    }

    generateKey(): void {
        const key = Math.random().toString(36).substring(2, 10).toUpperCase();
        this.context.setKey(key);
        this.context.setState(new KeyGeneratedState(this.context));
        Logger.getInstance().log(`Settlement ${this.context.getSettlementId()} key generated: ${key}`);
    }

    confirmSettlement(key: string): void {
        throw new Error("Key must be generated before confirmation.");
    }

    getStatus(): string {
        return "PENDING";
    }
}

export class KeyGeneratedState implements SettlementState {
    private context: SettlementContext;

    constructor(context: SettlementContext) {
        this.context = context;
    }

    generateKey(): void {
        throw new Error("Key already generated.");
    }

    confirmSettlement(key: string): void {
        if (this.context.getKey() === key) {
            this.context.setState(new SettledState(this.context));
            Logger.getInstance().log(`Settlement ${this.context.getSettlementId()} confirmed and settled.`);
        } else {
            throw new Error("Invalid settlement key.");
        }
    }

    getStatus(): string {
        return "KEY_GENERATED";
    }
}

export class SettledState implements SettlementState {
    private context: SettlementContext;

    constructor(context: SettlementContext) {
        this.context = context;
    }

    generateKey(): void {
        throw new Error("Settlement already completed.");
    }

    confirmSettlement(key: string): void {
        throw new Error("Settlement already completed.");
    }

    getStatus(): string {
        return "SETTLED";
    }
}

export class SettlementContext {
    private state: SettlementState;
    private settlementId: number;
    private settlementKey: string | null = null;

    constructor(settlementId: number) {
        this.settlementId = settlementId;
        this.state = new PendingState(this);
    }

    public setState(state: SettlementState): void {
        this.state = state;
    }

    public setKey(key: string): void {
        this.settlementKey = key;
    }

    public getKey(): string | null {
        return this.settlementKey;
    }

    public getSettlementId(): number {
        return this.settlementId;
    }

    public generateKey(): void {
        this.state.generateKey();
    }

    public confirmSettlement(key: string): void {
        this.state.confirmSettlement(key);
    }

    public getStatus(): string {
        return this.state.getStatus();
    }
}
