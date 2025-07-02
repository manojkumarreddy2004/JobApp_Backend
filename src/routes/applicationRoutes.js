import express from 'express';
import { getMyApplications } from '../controllers/applicationController.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate, authorizeRoles('job_seeker'));

router.get('/my', getMyApplications);

export default router;
