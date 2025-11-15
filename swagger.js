import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vehicle AI Inspection API",
      version: "1.0.0",
      description: "API for vehicle damage inspection with AI analysis",
    },
    servers: [
      {
        url: "http://localhost:8000/api",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"], // files with annotations
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));
};
