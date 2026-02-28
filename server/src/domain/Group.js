export class Group {
    id;
    name;
    createdAt;
    constructor(name, id, createdAt) {
        this.name = name;
        if (id !== undefined)
            this.id = id;
        if (createdAt !== undefined)
            this.createdAt = createdAt;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getCreatedAt() {
        return this.createdAt;
    }
}
//# sourceMappingURL=Group.js.map