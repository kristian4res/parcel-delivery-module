import express, { Request, Response } from 'express';
import { catchError } from '../controllers/errorController';

const router = express.Router();

/* GET home */
router.get('/', catchError(async (_req: Request, res: Response) => {
    res.status(200).send({
        'message': 'Backend API is online!'
    });
}));

router.get('/health', catchError(async (_req: Request, res: Response) => {
    res.status(200).send({
        'message': 'API is healthy'
    });
}));

export { router as indexRouter }
