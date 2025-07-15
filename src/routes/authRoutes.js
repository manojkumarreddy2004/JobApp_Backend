import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';
import {validateBody} from '../middlewares/inputValidator.js';
import { registerUserSchema, loginSchema } from '../validators/authSchema.js';
import { authenticate } from '../middlewares/auth.js';


const router = express.Router();

router.post('/register', validateBody(registerUserSchema),registerUser);
router.post('/login', validateBody(loginSchema), loginUser);
router.post('/logout', authenticate, logoutUser);

export default router;