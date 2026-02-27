export class Logger {
    private static instance: Logger;

    private constructor() { }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public log(message: string): void {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] INFO: ${message}`);
    }

    public error(message: string, error?: any): void {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] ERROR: ${message}`, error);
    }

    public warn(message: string): void {
        const timestamp = new Date().toISOString();
        console.warn(`[${timestamp}] WARN: ${message}`);
    }
}
