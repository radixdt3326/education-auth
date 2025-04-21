import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import express from "express";

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
        name: "Education site",
        description: "Education API",
      },
    ],
    servers: [
      {
        url: "http://localhost:4000/api/",
      },
    ],
  },
  apis: [
    "./src/Controllers/adminController.ts",
    "./src/Controllers/authController.ts",
    "./src/Controllers/publicController.ts",
    "./src/Controllers/userController.ts",
  ],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

const swaggerRouter = express.Router();
swaggerRouter.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

export default swaggerRouter;
