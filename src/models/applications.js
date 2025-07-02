import pool from "../config/db.js";

export const getMyApplicationsService = async (user_id)=>{
    const result = await pool.query(`SELECT * FROM applications WHERE user_id=$1`, [user_id]);
    return result.rows;
}