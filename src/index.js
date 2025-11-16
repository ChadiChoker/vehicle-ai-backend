import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import inspectionRoutes from "./routes/inspection.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import { setupSwagger } from "../swagger.js";

dotenv.config();
const app = express();

// 🟢 Correct CORS for Vercel + Localhost
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://vehicle-ai-frontend-chadi.vercel.app/", // ⬅️ change if needed
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json({ limit: "10mb" }));

app.use("/api/inspections", inspectionRoutes);

// Swagger docs
setupSwagger(app);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
