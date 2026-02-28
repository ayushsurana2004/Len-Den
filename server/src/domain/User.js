import bcrypt from 'bcrypt';
export class BaseUser {
    id;
    name;
    email;
    mobileNumber;
    passwordHash;
    constructor(name, passwordHash, email, mobileNumber, id) {
        this.name = name;
        this.passwordHash = passwordHash;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.id = id;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getEmail() {
        return this.email;
    }
    getMobileNumber() {
        return this.mobileNumber;
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
    async comparePassword(password) {
        return await bcrypt.compare(password, this.passwordHash);
    }
}
export class User extends BaseUser {
    constructor(name, passwordHash, email, mobileNumber, id) {
        super(name, passwordHash, email, mobileNumber, id);
    }
    validate() {
        if (!this.email && !this.mobileNumber)
            return false;
        if (this.email) {
            const re = /\S+@\S+\.\S+/;
            if (!re.test(this.email))
                return false;
        }
        if (this.mobileNumber) {
            const re = /^\+91\d{10}$/;
            if (!re.test(this.mobileNumber))
                return false;
        }
        return true;
    }
    static async create(name, password, email, mobileNumber) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return new User(name, hash, email, mobileNumber);
    }
}
//# sourceMappingURL=User.js.map