import pool from "../config/db.js";
import bcrypt from 'bcrypt';

export const getUserByEmail = async (email)=>{
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return result.rows[0];
}

export const createUser = async (userData)=>{
    const {name, email, password, role} = userData;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result =await pool.query(`INSERT INTO users (name, email, password, role) values ($1, $2, $3, $4) RETURNING *`, [name, email, hashedPassword, role]);
    return result.rows[0];
}

