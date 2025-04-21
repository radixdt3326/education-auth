"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const envConfig = process.env;
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5433", 10),
});
(async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL successfully!');
        client.release();
    }
    catch (err) {
        console.error('Unable to connect to PostgreSQL:', err.message);
    }
})();
exports.default = pool;
//# sourceMappingURL=dbConfig.js.map