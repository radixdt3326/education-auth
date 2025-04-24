import express from "express";
const router = express.Router();
import { getAdminDashboard } from "../Controllers/adminController";
import { isAdmin } from "../middlewares/isAdmin";
import { isUserLoggedIn } from "../middlewares/isUserloggedIn";
import pool from '../Db_connection/dbConfig';

// import { signin, signup } from "../controllers/user.js";

router.get("/admin-dashboard/:id",
    (req : express.Request, res : express.Response, next : express.NextFunction) => isUserLoggedIn(req, res, next, pool),
    (req : express.Request, res : express.Response, next : express.NextFunction) => isAdmin(req, res, next, pool),
    (req : express.Request, res : express.Response) => getAdminDashboard(req, res, pool));

export default router;