import pool from "../config/db.js";

export const createJobPostService = async (jobData, user_id)=>{
        const {title, description, location} = jobData;
        const userid = user_id;
        const result = await pool.query(`INSERT INTO jobs (title, description, location, posted_by) VALUES ($1, $2, $3, $4) RETURNING *`, [title, description, location, user_id]);
        return result.rows[0];
}

export const getMyJobPostsService = async (user_id)=>{
    const result = await pool.query('SELECT * FROM jobs WHERE posted_by=$1;', [user_id]);
    return result.rows;
}

export const getJobPostByIdService = async(job_id, user_id)=>{
        const result = await pool.query(`SELECT * FROM jobs WHERE id=$1 AND posted_by=$2;`, [job_id, user_id]);
        return result.rows;
}

export const deleteJobPostByIdService = async (job_id, user_id)=>{
    const result = await pool.query(`DELETE FROM jobs WHERE id=$1 AND posted_by=$2 RETURNING *;`, [job_id, user_id]);
    return result.rows[0];
}

export const updateJobPostByIdService = async(job_id, user_id, job_data)=>{
    const {title, description, location} = job_data;
    const result = await pool.query(`UPDATE jobs SET title=$1, description=$2, location=$3 WHERE id=$4 AND posted_by=$5 RETURNING *;`, [title, description, location, job_id, user_id]);
    return result.rows[0];
}

export const getApplicationsOfJobService = async (job_id)=>{
    const result = await pool.query(`SELECT 
        u.name AS user_name,
        u.email AS user_email,
        a.resume_url AS user_resume_link,
        a.current_location AS user_current_location
        FROM applications a
        JOIN users u ON a.user_id = u.id
        WHERE a.job_id = $1;`,
    [job_id]
    );
    
    return result.rows;
      
}