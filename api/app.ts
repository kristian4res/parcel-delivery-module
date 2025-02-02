import createError from 'http-errors';
import express, { NextFunction, Request, Response } from 'express';
import session from 'cookie-session';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit'
import { indexRouter } from './routes';
import { authRouter } from './routes/auth';
import { deliveryRouter } from './routes/delivery';

const server = express();

server.use(cors())
server.use(express.json({ limit: '10kb' }));
server.use(express.urlencoded({
    extended: false
}));
server.use(cookieParser());
server.set('trust proxy', 1);

// development logging
if (process.env['NODE_ENV'] === 'development') {
    server.use(logger('dev'));
}    

const limiter = rateLimit({
    max: 100,
    windowMs: 30 * 60 * 1000,
    standardHeaders: true, 
	legacyHeaders: false,
    message: 'Too many requests from this IP (maximum requests: 100), please try again later after 30 minutes!'
});
server.use('/api', limiter);

server.use(session({
    secret: process.env['SESSION_SECRET'] || 'secret',
    secure: process.env['NODE_ENV'] === 'production',
    signed: true,
    httpOnly: true,
}));

server.use('/api/v1/parcel-delivery', indexRouter);
server.use('/api/v1/parcel-delivery/delivery', deliveryRouter);
server.use('/api/v1/parcel-delivery/auth', authRouter);

// handle not found errors
server.all('*', async (req: Request, _res: Response, next: NextFunction) => {
    next(createError(404, `${req.originalUrl} cannot be found`))
});

// global error handler
server.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).send({
        errors: [{ message: 'Something went wrong', err: err.message}],
    });
});

export { server };