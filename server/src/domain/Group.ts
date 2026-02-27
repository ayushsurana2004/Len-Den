export class Group {
    private id?: number;
    private name: string;
    private createdAt?: Date;

    constructor(name: string, id?: number, createdAt?: Date) {
        this.name = name;
        if (id !== undefined) this.id = id;
        if (createdAt !== undefined) this.createdAt = createdAt;
    }

    public getId(): number | undefined {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getCreatedAt(): Date | undefined {
        return this.createdAt;
    }
}
