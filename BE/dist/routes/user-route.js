"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../Controllers/userController");
const isUserloggedIn_1 = require("../middlewares/isUserloggedIn");
const dbConfig_1 = __importDefault(require("../Db_connection/dbConfig"));
const router = express_1.default.Router();
router.get("/user-dashboard/:id", (req, res, next) => (0, isUserloggedIn_1.isUserLoggedIn)(req, res, next, dbConfig_1.default), (req, res) => (0, userController_1.getUserDashboard)(req, res, dbConfig_1.default));
exports.default = router;
//# sourceMappingURL=user-route.js.map