import express from "express";
import {signIn , register , logout , reauthentication} from "../Controllers/authController"
import { isUserLoggedIn } from "../middlewares/isUserloggedIn";
import pool from '../Db_connection/dbConfig';
const router = express.Router();

// import { signin, signup } from "../controllers/user.js";




router.post("/signin",  (req : express.Request,res: express.Response)=> signIn(req,res,pool) );
router.post("/register", (req : express.Request,res: express.Response)=> register(req,res,pool));
router.post("/logout", (req : express.Request,res: express.Response)=> logout(req,res,pool));
router.post("/reauth", (req : express.Request,res: express.Response)=> reauthentication(req,res,pool));

export default router;