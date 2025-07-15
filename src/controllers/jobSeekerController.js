

import {browseJobsService, browsejobsByLocationService, viewJobDetailsService, applyToJobService, checkUserAppliedService} from '../models/jobSeeker.js'
import { handleResponse } from "../utils/responseHandler.js";
import redis from '../config/redis.js';
import buildCacheKey from '../utils/cacheKeyBuilder.js';
// Gets All Jobs Available from all locations
export const browseJobs = async (req, res, next)=>{
    try{
        const cache_key = buildCacheKey("browseJobs", "all");
        const cached = await redis.get(cache_key);
        if (cached){
            return handleResponse(res, 200, "Successfully feteched all Jobs", JSON.parse(cached));
        }
        const result = await browseJobsService();
        if (result.length===0){
            return handleResponse(res, 404, "No Jobs Found");
        }
        await redis.set(cache_key, JSON.stringify(result), {EX:300});
        handleResponse(res, 200, "Successfully feteched all Jobs", result);

    }catch(err){
        next(err);
    }
}

// Gets Jobs by passing location in query params
export const searchJobsByLocation = async (req, res, next)=>{
    try{
        const {location} = req.query;
        const cache_key = buildCacheKey("browseJobs", location);
        const cached = await redis.get(cache_key);
        if (cached){
            return handleResponse(res, 200, `Successfully fetched all Jobs in ${location}`, JSON.parse(cached));
        }
        const result = await browsejobsByLocationService(location);
        if (result.length===0){
            return handleResponse(res, 404,`No Jobs Found in ${location}`);
        }
        await redis.set(cache_key, JSON.stringify(result), {EX:300});
        handleResponse(res, 200, `Successfully fetched all Jobs in ${location}`, result);
    }catch(err){
        next(err);
    }
}

//returns full details about a job if we provide a jobId
export const viewJobDetails = async (req, res, next)=>{
    try{
        const job_id = req.params.jobId;
        const cache_key = buildCacheKey("viewJobDetails", job_id);
        const cached = await redis.get(cache_key);
        if (cached){
            return handleResponse(res, 200, "Successfully fetches Job Details", JSON.parse(cached));
        }
        const result = await viewJobDetailsService(job_id);
        if (result.length==0){
            return handleResponse(res, 404, "Job Details Not Found");
        }
        await redis.set(cache_key, JSON.stringify(result), {EX:300});
        handleResponse(res, 200, "Successfully fetches Job Details", result);
    }catch(err){
        next(err);
    }
}

//users can apply for a job when they send neccesary data in body
export const applyToJob = async (req, res, next)=>{
    try{
        const application_data = req.body;
        const job_id = req.params.jobId;
        const user_id = req.user.user_id;
        const check = await checkUserAppliedService(job_id, user_id);
        if (check.length>0){
            return handleResponse(res, 400, "You have already applied for this job");
        }
        const cache_key = buildCacheKey("applications",user_id);
        await redis.del(cache_key);
        const result = await applyToJobService(application_data, job_id, user_id);
        handleResponse(res, 201, "Application Submitted Successfully", result);
    }catch(err){
        next(err);
    }
}