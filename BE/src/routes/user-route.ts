import express from "express";
import {getS3SecureUrl, getUserDashboard} from '../Controllers/userController'
import { isUserLoggedIn } from "../middlewares/isUserloggedIn";
import pool from '../Db_connection/dbConfig';
const router = express.Router();

router.get("/user-dashboard/getSecureurl", (req : express.Request,res: express.Response,next:express.NextFunction)=>isUserLoggedIn(req,res,next , pool ) ,(req,res)=> getS3SecureUrl(res));
router.get("/user-dashboard/:id", (req : express.Request,res: express.Response,next:express.NextFunction)=>isUserLoggedIn(req,res,next , pool ) ,(req,res)=> getUserDashboard(req,res,pool));

export default router;