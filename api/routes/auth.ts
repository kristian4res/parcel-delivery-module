import express from 'express';
import { handleUserLogout, handleUserLogin, handleUserRegistration, requireAuth } from '../controllers/authController';
import { validateRequest } from '../controllers/errorController';
import { body } from 'express-validator';

const router = express.Router();

const validateUsername = body('username')
    .notEmpty()
    .isString()
    .isAlphanumeric()
    .isLength({ max: 15, min: 1 })
    .withMessage('Please enter a valid username. It should not include any special characters (e.g. @£$%@^) and must be within 1 - 15 characters long.');

const validatePassword = body('password')
    .notEmpty()
    .isString()
    .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})
    .withMessage('Please enter a valid password. It must be at least 8 characters long with one lowercase and uppercase letter, one number and one symbol (e.g. %$@!)');

/* POST user logout */
router.post('/logout', 
    validateRequest, 
    requireAuth, 
    handleUserLogout
);
/* POST user login */
router.post('/login', 
    validateUsername,
    validatePassword,
    validateRequest, 
    handleUserLogin
);
/* POST user login */
router.post('/register',
    validateUsername,
    validatePassword,
    validateRequest,
    handleUserRegistration
);

export { router as authRouter }
