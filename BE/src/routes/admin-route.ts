import express from "express";
const router = express.Router();
import { getAdminDashboard } from "../Controllers/adminController";
import { isAdmin } from "../middlewares/isAdmin";
import { isUserLoggedIn } from "../middlewares/isUserloggedIn";
import pool from '../Db_connection/dbConfig';

// import { signin, signup } from "../controllers/user.js";

router.get("/admin-dashboard/:id",
    (req, res, next) => isUserLoggedIn(req, res, next, pool),
    (req, res, next) => isAdmin(req, res, next, pool),
    (req, res) => getAdminDashboard(req, res, pool));

export default router;