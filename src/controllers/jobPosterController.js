import {createJobPostService, getMyJobPostsService, getJobPostByIdService, deleteJobPostByIdService, updateJobPostByIdService, getApplicationsOfJobService}  from "../models/jobPoster.js";
import { handleResponse } from "../utils/responseHandler.js";

//Job Poster Post Job Controller
export const createJobPost = async(req, res, next)=>{
    try{
        const job_data = req.body;
        const user_id = req.user.userId;
        
        const result = await createJobPostService(job_data, user_id);
        handleResponse(res, 201, "Job Post Created Successfully", result);
    }catch(err){
        next(err);
    }
}

//Job Poster get all Jobs Controller
export const getMyJobPosts = async (req, res, next)=>{
    try{
        const user_id = req.user.userId;
        const result = await getMyJobPostsService(user_id);
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

        const result = await getJobPostByIdService(job_id, user_id);
        if (result.length===0){
            return res.status(404).json({message:"Job Post Not Found", status:404});
        }
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
        const result = await getApplicationsOfJobService(job_id);
        handleResponse(res, 200, "Applications Fetched Successfully", result);
    }catch(err){
        next(err);

    }
}