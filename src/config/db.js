import pkg from "pg";

import dotenv from 'dotenv';

const {Pool} = pkg;

dotenv.config();


const pool = new Pool({
    host:process.env.DB_HOST,
    password:process.env.DB_PASSWORD,
    user:process.env.DB_USER,
    port:process.env.DB_PORT,
    database:process.env.DB_DATABASE
});

pool.on("connect", ()=>console.log("connected to postgres db"));

export default pool;
