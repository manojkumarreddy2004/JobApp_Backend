import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
// import pool from './config/db.js'
import createTables from "./data/createTables.js";
import errorHandler from './middlewares/errorHandler.js';

import apiRoutes from "./routes/index.js";
dotenv.config();

const app = express();

const port = process.env.PORT || 3000;


//middlewares
app.use(express.json());
app.use(cors());

createTables();


//Routes
app.use("/api", apiRoutes);


//Error Handling
app.use(errorHandler);



//server running
app.listen(port, ()=> console.log(`App is Runnning at Port : ${port}`));


