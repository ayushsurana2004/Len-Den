export declare abstract class BaseUser {
    protected id?: number | undefined;
    protected name: string;
    protected email?: string | undefined;
    protected mobileNumber?: string | undefined;
    protected passwordHash: string;
    constructor(name: string, passwordHash: string, email?: string, mobileNumber?: string, id?: number);
    abstract validate(): boolean;
    getId(): number | undefined;
    getName(): string;
    getEmail(): string | undefined;
    getMobileNumber(): string | undefined;
    protected hashPassword(password: string): Promise<string>;
    comparePassword(password: string): Promise<boolean>;
}
export declare class User extends BaseUser {
    constructor(name: string, passwordHash: string, email?: string, mobileNumber?: string, id?: number);
    validate(): boolean;
    static create(name: string, password: string, email?: string, mobileNumber?: string): Promise<User>;
}
//# sourceMappingURL=User.d.ts.map