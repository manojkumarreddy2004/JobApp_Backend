import { application } from 'express';
import pool from '../config/db.js'

export const browseJobsService = async ()=>{
    const result = await pool.query('SELECT * FROM jobs;');
    return result.rows;
}

export const browsejobsByLocationService = async (location)=>{
    const result = await pool.query(`SELECT * FROM jobs WHERE location=$1;`, [location]);
    return result.rows;
}

export const viewJobDetailsService = async (job_id)=>{
    const result = await pool.query(`SELECT * FROM jobs WHERE id=$1;`, [job_id]);
    return result.rows;
}


export const checkUserAppliedService = async(job_id, user_id)=>{
    const check = await pool.query(`SELECT * FROM applications WHERE job_id = $1 AND user_id = $2`,[job_id, user_id]);
    return check.rows;
}

export const applyToJobService = async(application_data, job_id, user_id)=>{
    const {resume_url, current_location} = application_data;
    const result = await pool.query(`INSERT INTO applications (job_id, user_id, resume_url, current_location) VALUES ($1, $2, $3, $4) RETURNING *;`, [job_id, user_id, resume_url, current_location]);
    return result.rows[0];
}

