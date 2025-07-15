
import {getMyApplicationsService} from '../models/applications.js'
import { handleResponse } from "../utils/responseHandler.js";
import redis from '../config/redis.js';
import buildCacheKey from '../utils/cacheKeyBuilder.js';



//Lists all the applications of a user controller
export const getMyApplications = async (req, res, next)=>{
    try{
        const user_id = req.user.user_id;
        const key = buildCacheKey("applications",user_id);
        const cacheData = await redis.get(key);
        if (cacheData){
            return handleResponse(res, 200, "SuccessFully Fetched all the Applications", JSON.parse(cacheData));
        }
        const result = await getMyApplicationsService(user_id);
        await redis.set(key, JSON.stringify(result), {EX:300});
        if (result.length===0){
            return handleResponse(res, 404, "No Applications Found");
        }
        handleResponse(res, 200, "SuccessFully Fetched all the Applications", result);
    }catch(err){
        next(err);
    }  
}