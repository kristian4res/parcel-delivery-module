import { NextFunction, Request, Response } from "express";
import { catchError } from "./errorController";
import { doesUserExist, findUserDetails, insertUserRecord } from "../database/auth";
import { generateToken, verifyToken } from "../helpers/jwt";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.jwt) {
        return res.status(401).json({ message: 'Unauthorized, token required' });
    }
    else {
        const token = req.session.jwt;
        
        try {
            const decoded = verifyToken(token); 

            req.session.user = decoded; 
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
};  


export const handleUserLogout = catchError(async (req: Request, res: Response) => {
    try {
        if (!req.session) {
            res.status(400).json({ message: 'Session not found, could not logout user' });
        }
        else {
            req.session = null;
            res.status(200).json({ message: 'Logout successful' });
        }
    } catch (error) {
        throw error;
    }
});

export const handleUserRegistration = catchError(async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (await doesUserExist(username)) {
            res.status(409).json({ message: 'Username already exists' });
        }
        else {
            const userRegistered = await insertUserRecord(username, password);
            if (!userRegistered) {
                console.error('Could not register user');
                res.status(500).json({ message: 'Could not register user' });
            }
            console.log('Successfully registered user');
            res.status(201).json({ message: `Successfully registered user ${username}. You can now login with user ${username}.` });
        }
    } catch (error) {
        throw error;
    }
});

export const handleUserLogin = catchError(async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const query = await findUserDetails(username, password);
        const user = query.data;

        if (!user) {
            res.status(401).json({ auth: false, toast: 'Fail', message: 'Invalid credentials' });
        }
        else {
            const token = generateToken({ id: user.id, username: user.username, role: user.role });
            req.session = {
                jwt: token
            };
            res.status(200).json({ auth: true, toast: 'Successful', token: token });
        }        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error while trying to authenticate user' });
    }
});