import express from "express";
import { getAboutData } from "../Controllers/publicController";
const router = express.Router();
import pool from '../Db_connection/dbConfig';


router.get("/about", (req,res)=> getAboutData(req,res,pool));


export default router;