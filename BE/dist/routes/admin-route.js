"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const adminController_1 = require("../Controllers/adminController");
const isAdmin_1 = require("../middlewares/isAdmin");
const isUserloggedIn_1 = require("../middlewares/isUserloggedIn");
const dbConfig_1 = __importDefault(require("../Db_connection/dbConfig"));
router.get("/admin-dashboard/:id", (req, res, next) => (0, isUserloggedIn_1.isUserLoggedIn)(req, res, next, dbConfig_1.default), (req, res, next) => (0, isAdmin_1.isAdmin)(req, res, next, dbConfig_1.default), (req, res) => (0, adminController_1.getAdminDashboard)(req, res, dbConfig_1.default));
exports.default = router;
//# sourceMappingURL=admin-route.js.map