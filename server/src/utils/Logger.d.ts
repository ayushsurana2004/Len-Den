export declare class Logger {
    private static instance;
    private constructor();
    static getInstance(): Logger;
    log(message: string): void;
    error(message: string, error?: any): void;
    warn(message: string): void;
}
//# sourceMappingURL=Logger.d.ts.map