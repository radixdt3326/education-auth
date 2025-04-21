import express from "express";
import {signIn , register , logout , reauthentication} from "../Controllers/authController"
import { isUserLoggedIn } from "../middlewares/isUserloggedIn";
import pool from '../Db_connection/dbConfig';
const router = express.Router();

// import { signin, signup } from "../controllers/user.js";




router.post("/signin",  (req,res)=> signIn(req,res,pool) );
router.post("/register", (req,res)=> register(req,res,pool));
router.post("/logout", (req,res)=> logout(req,res,pool));
router.post("/reauth", (req,res)=> reauthentication(req,res,pool));

export default router;