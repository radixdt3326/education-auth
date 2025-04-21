import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from 'express-rate-limit';
import httpLogger from "../middlewares/httpLogger";
import router from "../routes/index";

const app: express.Application = express();

// Middlewares
app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests from this IP, please try again later",
  });
  app.use(limiter);

// CORS Configuration
app.use(
  cors({
    origin: "*", // Change for production
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-sessid"],
    credentials: true,
  })
);

// Routes
app.use("/api", router);

// Default route
app.get("/testpoint", (req, res) => res.json({ message: "I am up!" }));

// 404 Handler
app.use("/*", (req, res) => {
  res.status(404).send("Url Not Found");
});

export default app;
