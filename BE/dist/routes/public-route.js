"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const publicController_1 = require("../Controllers/publicController");
const router = express_1.default.Router();
const dbConfig_1 = __importDefault(require("../Db_connection/dbConfig"));
router.get("/about", (req, res) => (0, publicController_1.getAboutData)(req, res, dbConfig_1.default));
exports.default = router;
//# sourceMappingURL=public-route.js.map