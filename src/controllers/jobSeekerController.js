

import {browseJobsService, browsejobsByLocationService, viewJobDetailsService, applyToJobService, checkUserAppliedService} from '../models/jobSeeker.js'
import { handleResponse } from "../utils/responseHandler.js";

// Gets All Jobs Available from all locations
export const browseJobs = async (req, res, next)=>{
    try{
        const result = await browseJobsService();
        if (result.length===0){
            return handleResponse(res, 404, "No Jobs Found");
        }
        handleResponse(res, 200, "Successfully feteched all Jobs", result);
    }catch(err){
        next(err);
    }
}

// Gets Jobs by passing location in query params
export const searchJobsByLocation = async (req, res, next)=>{
    try{
        const {location} = req.query;
        const result = await browsejobsByLocationService(location);
        if (result.length===0){
            return handleResponse(res, 404,`No Jobs Found in ${location}`);
        }
        handleResponse(res, 200, `Successfully fetched all Jobs in ${location}`, result);
    }catch(err){
        next(err);
    }
}

//returns full details about a job if we provide a jobId
export const viewJobDetails = async (req, res, next)=>{
    try{
        const job_id = req.params.jobId;
        const result = await viewJobDetailsService(job_id);
        if (result.length==0){
            return handleResponse(res, 404, "Job Details Not Found");
        }
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
        const result = await applyToJobService(application_data, job_id, user_id);
        handleResponse(res, 201, "Application Submitted Successfully", result);
    }catch(err){
        next(err);
    }
}