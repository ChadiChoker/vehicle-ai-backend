import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import inspectionRoutes from "./routes/inspection.routes.js";
import { setupSwagger } from "../swagger.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/inspections", inspectionRoutes);

setupSwagger(app);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
