import express from 'express';
import {browseJobs, searchJobsByLocation, viewJobDetails, applyToJob } from '../controllers/jobSeekerController.js';
import {jobIdParamSchema, locationQuerySchema, jobApplicationSchema } from '../validators/jobSchema.js';
import {validateBody, validatePathParams, validateQueryParams} from '../middlewares/inputValidator.js';

import { authenticate, authorizeRoles } from '../middlewares/auth.js';



const router = express.Router();

router.use(authenticate, authorizeRoles('job_seeker'));

router.get('/', browseJobs);
router.get('/search', validateQueryParams(locationQuerySchema),searchJobsByLocation);
router.get('/:jobId',validatePathParams(jobIdParamSchema), viewJobDetails);
router.post('/:jobId/apply', validatePathParams(jobIdParamSchema), validateBody(jobApplicationSchema),applyToJob);

export default router;
