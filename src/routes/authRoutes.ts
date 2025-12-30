import { Router } from 'express'
import { register, login } from '../controllers/authController.ts';
import { validateBody } from '../middleware/validation.ts';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
})

const router = Router();

router.post('/register', register)

router.post('/login', validateBody(loginSchema), login)

export default router;