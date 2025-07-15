import jwt from 'jsonwebtoken';
import { handleResponse } from '../utils/responseHandler.js';
import redis from '../config/redis.js';
import buildCacheKey from '../utils/cacheKeyBuilder.js';
const jwt_secret = process.env.JWT_SECRET || "Hello This is MY APP";

// authenticate User by verifying JWT token recieved from user middleware
export const authenticate = async (req, res, next)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return handleResponse(res, 401, "No Token Provided (Login to Get Token)");
    }
    const token = authHeader.split(" ")[1];
    const blacklisted = await redis.get(buildCacheKey("blacklist", token));
    if (blacklisted) return handleResponse(res, 401, "Invalid Token: Token Blacklisted");

    try{
        const decoded = jwt.verify(token, jwt_secret);
        req.user = decoded;
        next();
    }catch(error){
        return handleResponse(res, 401, error.message);
    }
}

// Authorizing by user role by getting the data encoded in jwt token Controller
export const authorizeRoles = (...roles)=>{
    return (req, res, next)=>{
        if (!roles.includes(req.user.role)){
            return handleResponse(res, 403, "Access Denied: You are not authorized to perform this action");
        }
        next();
    }
}