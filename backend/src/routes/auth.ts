import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { registerValidator, loginValidator } from '../validators/auth';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.get('/me', authenticate, getMe);

export default router;
