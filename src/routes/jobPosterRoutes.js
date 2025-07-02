import express from 'express';
import {createJobPost, getMyJobPosts, getJobPostById, deleteJobPostById, updateJobPostById, getApplicationsOfJob} from '../controllers/jobPosterController.js';

import { authenticate, authorizeRoles } from '../middlewares/auth.js';
import { createOrUpdateJobSchema, jobIdParamSchema } from '../validators/jobSchema.js';
import {validateBody, validatePathParams} from '../middlewares/inputValidator.js';

const router = express.Router();



router.use(authenticate, authorizeRoles('job_poster'));

router.post('/', validateBody(createOrUpdateJobSchema),createJobPost);
router.get('/', getMyJobPosts);
router.get('/:jobId', validatePathParams(jobIdParamSchema),getJobPostById);
router.put('/:jobId',validateBody(createOrUpdateJobSchema),updateJobPostById);
router.delete('/:jobId',  validatePathParams(jobIdParamSchema), deleteJobPostById);
router.get('/:jobId/applications',  validatePathParams(jobIdParamSchema), getApplicationsOfJob);

export default router;