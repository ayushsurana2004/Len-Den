import { Logger } from '../utils/Logger.js';
export class PendingState {
    context;
    constructor(context) {
        this.context = context;
    }
    generateKey() {
        const key = Math.random().toString(36).substring(2, 10).toUpperCase();
        this.context.setKey(key);
        this.context.setState(new KeyGeneratedState(this.context));
        Logger.getInstance().log(`Settlement ${this.context.getSettlementId()} key generated: ${key}`);
    }
    confirmSettlement(key) {
        throw new Error("Key must be generated before confirmation.");
    }
    getStatus() {
        return "PENDING";
    }
}
export class KeyGeneratedState {
    context;
    constructor(context) {
        this.context = context;
    }
    generateKey() {
        throw new Error("Key already generated.");
    }
    confirmSettlement(key) {
        if (this.context.getKey() === key) {
            this.context.setState(new SettledState(this.context));
            Logger.getInstance().log(`Settlement ${this.context.getSettlementId()} confirmed and settled.`);
        }
        else {
            throw new Error("Invalid settlement key.");
        }
    }
    getStatus() {
        return "KEY_GENERATED";
    }
}
export class SettledState {
    context;
    constructor(context) {
        this.context = context;
    }
    generateKey() {
        throw new Error("Settlement already completed.");
    }
    confirmSettlement(key) {
        throw new Error("Settlement already completed.");
    }
    getStatus() {
        return "SETTLED";
    }
}
export class SettlementContext {
    state;
    settlementId;
    settlementKey = null;
    constructor(settlementId) {
        this.settlementId = settlementId;
        this.state = new PendingState(this);
    }
    setState(state) {
        this.state = state;
    }
    setKey(key) {
        this.settlementKey = key;
    }
    getKey() {
        return this.settlementKey;
    }
    getSettlementId() {
        return this.settlementId;
    }
    generateKey() {
        this.state.generateKey();
    }
    confirmSettlement(key) {
        this.state.confirmSettlement(key);
    }
    getStatus() {
        return this.state.getStatus();
    }
}
//# sourceMappingURL=SettlementState.js.map