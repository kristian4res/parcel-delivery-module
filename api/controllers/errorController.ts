import { NextFunction, Request, Response } from "express";
import { validationResult } from 'express-validator';

/**
 * A higher-order function that wraps an asynchronous express middleware function.
 * It catches any errors that the middleware function might throw, and passes them to Express's error handling pipeline.
 *
 * @param {Function} func - The middleware function to wrap. It should be a function that takes a Request, a Response, and a NextFunction, and returns a Promise.
 * @return {Function} - The wrapped middleware function.
 */
export const catchError = (func: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        func(req, res, next).catch(next);
    };
};

/**
 * Middleware function to validate incoming requests.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {void} - The function does not return a value. It either sends a response with validation errors or calls the next middleware function.
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};