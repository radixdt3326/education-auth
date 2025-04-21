"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../Controllers/authController");
const dbConfig_1 = __importDefault(require("../Db_connection/dbConfig"));
const router = express_1.default.Router();
router.post("/signin", (req, res) => (0, authController_1.signIn)(req, res, dbConfig_1.default));
router.post("/register", (req, res) => (0, authController_1.register)(req, res, dbConfig_1.default));
router.post("/logout", (req, res) => (0, authController_1.logout)(req, res, dbConfig_1.default));
router.post("/reauth", (req, res) => (0, authController_1.reauthentication)(req, res, dbConfig_1.default));
exports.default = router;
//# sourceMappingURL=auth-route.js.map