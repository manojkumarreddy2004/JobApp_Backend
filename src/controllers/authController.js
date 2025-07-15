import { createUser, getUserByEmail } from "../models/auth.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import redis from '../config/redis.js';
import bcrypt from 'bcrypt';
import buildCacheKey from "../utils/cacheKeyBuilder.js";
import { handleResponse } from "../utils/responseHandler.js";
dotenv.config();

const jwt_secret = process.env.JWT_SECRET || "Hello This is MY APP";
const SESSION_EXPIRY = 7*24*60*60;

//Registration of User Controller
export const registerUser = async (req, res, next)=>{
    try{
        const userData = req.body;
        const isUserExist = await getUserByEmail(userData.email);
        if(isUserExist){
            handleResponse(res, 400, "User Already Exists With Given Email" );
        }else{
            const result = await createUser(userData);
            handleResponse(res, 201, "User Created Successfully", result);
        }
    }catch(err){
        next(err);
    }
}

//Login the user by sending JWT Token COntroller
export const loginUser = async(req, res, next)=>{
    try{
        const userData = req.body;
        const {email, password} = userData;
        const ip = req.ip;
        const rateLimitKey = buildCacheKey("fail",ip);

        const fails = await redis.incr(rateLimitKey);
        if (fails==1) await redis.expire(rateLimitKey, 300);

        if (fails>5){
            return handleResponse(res, 429, "Too Many Login Attemps, Try after 5 minutes")
        }
        const user = await getUserByEmail(email);
        if (!user){
            return handleResponse(res, 401, "Invalid Email");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return handleResponse(res, 401, "Invalid Password");
        }

        await redis.del(rateLimitKey);

        const jwtToken = jwt.sign({user_id:user.id, role:user.role}, jwt_secret, {expiresIn:'7d'});

        return handleResponse(res, 200, "Login Successful", {
            "user":user.name,
            "role":user.role,
            "id":user.id,
            "token":jwtToken
        });
    }catch(err){
        next(err);
    }
}

// Logout Controller to Blacklist Token & Clear Session
export const logoutUser = async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const userId = req.user.user_id;
      const cache_key = buildCacheKey("blacklist", token);
  
      await redis.set(cache_key, "true", { EX: SESSION_EXPIRY });
  
      return handleResponse(res, 200, "Logged out successfully");
    } catch (err) {
      next(err);
    }
  };
  