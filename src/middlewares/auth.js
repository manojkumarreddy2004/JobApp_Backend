import jwt from 'jsonwebtoken';

const jwt_secret = process.env.JWT_SECRET || "Hello This is MY APP";

// authenticate User by verifying JWT token recieved from user middleware
export const authenticate = (req, res, next)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"Unauthorized"});        
    }
    try{
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, jwt_secret);
        req.user = decoded;
        next();
    }catch(error){
        return res.status(401).json({message:`${error}`});
    }
}

// Authorizing by user role by getting the data encoded in jwt token Controller
export const authorizeRoles = (...roles)=>{
    return (req, res, next)=>{
        if (!roles.includes(req.user.role)){
            return res.status(403).json({message:"Access Denied: You are not authorized to perform this action"});
        }
        next();
    }
}