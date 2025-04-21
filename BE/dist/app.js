"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const node_cron_1 = __importDefault(require("node-cron"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const error_1 = require("./helpers/error");
const httpLogger_1 = __importDefault(require("./middlewares/httpLogger"));
const index_1 = __importDefault(require("./routes/index"));
const dbConfig_1 = __importDefault(require("./Db_connection/dbConfig"));
const common_1 = require("./utils/common");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app = (0, express_1.default)();
app.use(httpLogger_1.default);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later",
});
app.use(limiter);
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', "x-sessid"],
    credentials: true,
}));
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0",
            description: "API documentation using Swagger",
        },
        tags: [
            {
                name: 'Education site',
                description: 'Education API',
            },
        ],
        servers: [
            {
                url: 'http://localhost:4000/api/',
            },
        ],
    },
    apis: ["./src/Controllers/adminController.ts",
        "./src/Controllers/authController.ts",
        "./src/Controllers/publicController.ts",
        "./src/Controllers/userController.ts"],
};
app.use('/api', index_1.default);
app.get('/testpoint', (req, res) => res.json({ message: "I am up !" }));
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.use('/*', (req, res) => {
    res.status(404).send("Url Not Found");
});
app.use((_req, _res, next) => {
    next((0, http_errors_1.default)(404));
});
const errorHandler = (err, _req, res) => {
    (0, error_1.handleError)(err, res);
};
app.use(errorHandler);
const port = process.env.PORT || '8000';
app.set('port', port);
const server = http_1.default.createServer(app);
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    switch (error.code) {
        case 'EACCES':
            process.exit(1);
            break;
        case 'EADDRINUSE':
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr === null || addr === void 0 ? void 0 : addr.port}`;
    console.info(`Server is listening on ${bind}`);
}
node_cron_1.default.schedule("0 9,21 * * *", async () => {
    console.log("⏳ Running scheduled database query...");
    try {
        await (0, common_1.removeExpiredSession)(dbConfig_1.default);
        const result = await dbConfig_1.default.query("SELECT * FROM user_table");
        console.log("✅ Expired sessions removed successfully:", result.rows);
    }
    catch (err) {
        console.error("❌ Error while removing expired sessions:", err.message);
    }
});
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
//# sourceMappingURL=app.js.map