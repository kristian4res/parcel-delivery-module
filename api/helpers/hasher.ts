import bcryptjs from 'bcryptjs';

class Hasher {
    private saltRounds: number;
    
    constructor() {
        this.saltRounds = 10;
    }

    hashPassword(password: string): string {
        return bcryptjs.hashSync(password, this.saltRounds);
    }

    comparePassword(password: string, hash: string): boolean {
        return bcryptjs.compareSync(password, hash);
    }
}

export default Hasher;