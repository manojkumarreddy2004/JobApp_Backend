import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import {validateBody} from '../middlewares/inputValidator.js';
import { registerUserSchema, loginSchema } from '../validators/authSchema.js';


const router = express.Router();

router.post('/register', validateBody(registerUserSchema),registerUser);
router.post('/login', validateBody(loginSchema), loginUser);

export default router;