import express from 'express';
import authRoutes from './authRoutes.js';
import applicationRoutes from './applicationRoutes.js';
import jobPosterRoutes from './jobPosterRoutes.js';
import jobSeekerRoutes from './jobSeekerRoutes.js';


const router = express.Router();

router.use('/auth', authRoutes);
router.use('/applications', applicationRoutes);
router.use('/poster/jobs', jobPosterRoutes);
router.use('/jobs', jobSeekerRoutes);

export default router;
