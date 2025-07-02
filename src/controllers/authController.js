import { createUser, getUserByEmail } from "../models/auth.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { handleResponse } from "../utils/responseHandler.js";
dotenv.config();

const jwt_secret = process.env.JWT_SECRET || "Hello This is MY APP";


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
        const user = await getUserByEmail(email);
        if (!user){
            return handleResponse(res, 401, "Invalid Email");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return handleResponse(res, 401, "Invalid Password");
        }

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