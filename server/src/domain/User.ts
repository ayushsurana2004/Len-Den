import bcrypt from 'bcrypt';

export abstract class BaseUser {
    protected id?: number | undefined;
    protected name: string;
    protected email?: string | undefined;
    protected mobileNumber?: string | undefined;
    protected passwordHash: string;

    constructor(name: string, passwordHash: string, email?: string, mobileNumber?: string, id?: number) {
        this.name = name;
        this.passwordHash = passwordHash;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.id = id;
    }

    public abstract validate(): boolean;

    public getId(): number | undefined {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string | undefined {
        return this.email;
    }

    public getMobileNumber(): string | undefined {
        return this.mobileNumber;
    }

    protected async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    public async comparePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.passwordHash);
    }
}

export class User extends BaseUser {
    constructor(name: string, passwordHash: string, email?: string, mobileNumber?: string, id?: number) {
        super(name, passwordHash, email, mobileNumber, id);
    }

    public validate(): boolean {
        if (!this.email && !this.mobileNumber) return false;
        if (this.email) {
            const re = /\S+@\S+\.\S+/;
            if (!re.test(this.email)) return false;
        }
        if (this.mobileNumber) {
            const re = /^\+91\d{10}$/;
            if (!re.test(this.mobileNumber)) return false;
        }
        return true;
    }

    public static async create(name: string, password: string, email?: string, mobileNumber?: string): Promise<User> {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return new User(name, hash, email, mobileNumber);
    }
}
