import crypto from 'crypto';

class TokenGenerator {
    private tokenSecret: string;

    constructor() {
        this.tokenSecret = process.env.TOKEN_SECRET || '';
    }

    generateToken() {
        const salt = crypto.randomBytes(16).toString('hex');
        const token = crypto.pbkdf2Sync(this.tokenSecret, salt, 1000, 16, `sha512`).toString(`hex`);
        return token;
    }
}

const tokenGenerator = new TokenGenerator();

export { tokenGenerator as default };