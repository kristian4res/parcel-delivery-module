import jwt from "jsonwebtoken";
import { UserDetails } from "../interfaces/auth";

const JWT_KEY = process.env['JWT_SECRET'] as unknown as string;

export const generateToken = (user: UserDetails) => {
    return jwt.sign(user, JWT_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_KEY);
    } catch (error) {
        return null;
    }
};