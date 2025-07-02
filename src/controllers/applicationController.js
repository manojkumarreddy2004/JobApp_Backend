
import {getMyApplicationsService} from '../models/applications.js'

//Lists all the applications of a user controller
export const getMyApplications = async (req, res, next)=>{
    try{
        const user_id = req.user.user_id;
        const result = await getMyApplicationsService(user_id);
        console.log(result);
        if (result.length===0){
            return res.send(404).json({status:404, message: "No Job Applications Found"});
        }
        res.status(200).json({status:200, message:"SuccessFully Fetched all the Applications", data:result});
    }catch(err){
        next(err);
    }
    

}