import {createJobPostService, getMyJobPostsService, getJobPostByIdService, deleteJobPostByIdService, updateJobPostByIdService, getApplicationsOfJobService}  from "../models/jobPoster.js";
import { handleResponse } from "../utils/responseHandler.js";
import redis from "../config/redis.js";
import buildCacheKey from "../utils/cacheKeyBuilder.js";


//Job Poster Post Job Controller
export const createJobPost = async(req, res, next)=>{
    try{
        const job_data = req.body;
        const user_id = req.user.userId;
        const result = await createJobPostService(job_data, user_id);
        await redis.del(buildCacheKey("myJobPosts", user_id));
        await redis.del(buildCacheKey("browseJobs", "all"));
        handleResponse(res, 201, "Job Post Created Successfully", result);
    }catch(err){
        next(err);
    }
}

//Job Poster get all Jobs Controller
export const getMyJobPosts = async (req, res, next)=>{
    try{
        const user_id = req.user.userId;
        const cache_key = buildCacheKey("myJobPosts", user_id);
        const cached = await redis.get(cache_key);
        if (cached){
            return handleResponse(res, 200, "Job Posts Fetched Successfully", JSON.parse(cached));
        }
        const result = await getMyJobPostsService(user_id);
        await redis.set(cache_key, JSON.stringify(result), {EX:300});
        handleResponse(res, 200, "Job Posts Fetched Successfully", result);
    }catch(err){
        next(err);
    }
    
}

//Job Poster gets JobPost Details by providing job id Controller
export const getJobPostById = async(req, res, next)=>{
    try{
        const job_id = req.params.jobId;
        const user_id = req.user.user_id;
        const cache_key = buildCacheKey("jobPost", job_id);
        const cached = await redis.get(cache_key);
        if (cached){
            return handleResponse(res, 200, "Job Post Fetched Successfully", JSON.parse(cached));
        }
        const result = await getJobPostByIdService(job_id, user_id);
        if (result.length===0){
            return res.status(404).json({message:"Job Post Not Found", status:404});
        }
        await redis.set(cache_key, JSON.stringify(result), {EX:300});
        handleResponse(res, 200, "Job Post Fetched Successfully", result);
    }catch(err){
        next(err);

    }
}

//Job Poster Deletes Job Post by providing JobID Controller
export const deleteJobPostById = async (req, res, next)=>{
    try{
        const job_id = req.params.jobId;
        const user_id = req.user.user_id;
        await redis.del(buildCacheKey("jobPost", job_id));
        await redis.del(buildCacheKey("myJobPosts", user_id));
        await redis.del(buildCacheKey("browseJobs", "all"));
        await redis.del(buildCacheKey("viewJobDetails", job_id));
        await redis.del(buildCacheKey("jobPostApplications", job_id));
        const result = await deleteJobPostByIdService(job_id, user_id);
        handleResponse(res, 200, "Job Post Deleted Successfully", result);

    }catch(err){
        next(err);
    }
}

//Job Poster can update a job post by providing necessary details controller
export const updateJobPostById = async (req, res, next)=>{
    try{
        const job_id = req.params.jobId;
        const user_id = req.user.user_id;
        const job_data = req.body;
        await redis.del(buildCacheKey("JobPost", job_id));
        await redis.del(buildCacheKey("MyJobPosts", user_id));
        await redis.del(buildCacheKey("browseJobs", "all"));
        await redis.del(buildCacheKey("viewJobDetails", job_id));
        const result = await updateJobPostByIdService(job_id, user_id, job_data);
        handleResponse(res, 200, "Job Post Updated Successfully", result);
    }catch(err){
        next(err);
    }
}

//Lists all applications of a job controller
export const getApplicationsOfJob = async (req,res, next)=>{
    try{
        const job_id = req.params.jobId;
        const user_id = req.user.user_id;

        // Validate ownership before fetching applications
        const jobPost = await getJobPostByIdService(job_id, user_id);
        if (!jobPost || jobPost.length === 0) {
            return handleResponse(res, 404, "Job Post Not Found");
        }

        const cache_key = buildCacheKey("JobPostApplications", job_id);
        const cached = await redis.get(cache_key);
        if (cached) {
            return handleResponse(res, 200, "Applications Fetched Successfully", JSON.parse(cached));
        }
        const result = await getApplicationsOfJobService(job_id);
        await redis.set(cache_key, JSON.stringify(result), {EX:300});
        handleResponse(res, 200, "Applications Fetched Successfully", result);
    }catch(err){
        next(err);
    }
}