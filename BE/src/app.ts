import createError from 'http-errors';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from 'http';
import helmet from "helmet";
import rateLimit from 'express-rate-limit';
import cron from "node-cron";
import cors from 'cors';
// import { toNodeHandler } from "better-auth/node";
// import { auth } from './lib/auth';    s

import { handleError } from './helpers/error';
import httpLogger from './middlewares/httpLogger';
import router from './routes/index';
import pool from './Db_connection/dbConfig';
import { removeExpiredSession } from './utils/common';
import swagerJSDoc from 'swagger-jsdoc';
import swagerui from 'swagger-ui-express';

dotenv.config({ path: path.join(__dirname, '../.env') });

const app: express.Application = express();

app.use(httpLogger);
app.use(cookieParser());
app.use(helmet());

app.get("/", (req,res)=>res.status(200).send("server is running on 5000"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

app.use(
  cors({
    origin: 'http://3.23.101.191', // Change to specific origin in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization' , "x-sessid"],
    credentials:true
  })
);

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
  "./src/Controllers/userController.ts"], // Path to API routes
};

// const csrfProtection = CSRF({ cookie: true });
// app.use(csrfProtection);



app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// app.all("/api/auth/sign-in/social",  toNodeHandler(auth)); 
app.use('/api', router);

app.post("/api/auth", (req,res)=>console.log(req))

app.get('/testpoint', (req,res)=>res.json({message : "I am up !"}));

const swaggerDocs = swagerJSDoc(swaggerOptions);
app.use("/api-docs", swagerui.serve, swagerui.setup(swaggerDocs));

app.use('/*',(req,res)=>
{
  res.status(404).send("Url Not Found");
})



// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// error handler
const errorHandler: express.ErrorRequestHandler = (err, _req, res) => {
  handleError(err, res);
};
app.use(errorHandler);

const port = process.env.PORT || '5000';
app.set('port', port);
app.set('host','0.0.0.0');

const server = http.createServer(app);

function onError(error: { syscall: string; code: string }) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
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
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  console.info(`Server is listening on ${bind}`);
}


cron.schedule("0 9,21 * * *", async () => {
  console.log("⏳ Running scheduled database query...");
  try {

   await removeExpiredSession(pool)
    const result = await pool.query("SELECT * FROM user_table"); // Example query
    console.log("✅ Expired sessions removed successfully:", result.rows);
  } catch (err) {
    console.error("❌ Error while removing expired sessions:", err.message);
  }
});
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


// // Below is the new version of server.ts with commented out code

// import app from "./configs/appconfigs";
// import swaggerRouter from "./configs/swaggerConfig";
// import "./configs/cronJobs"; // Importing to run cron jobs

// app.use(swaggerRouter);

