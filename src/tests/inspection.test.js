import request from "supertest";
import express from "express";
import inspectionRoutes from "../routes/inspection.routes.js";
import errorHandler from "../middlewares/errorHandler.js";
import { db } from "../utils/memoryStore.js";

// Setup Express app for testing
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use("/api/inspections", inspectionRoutes);
app.use(errorHandler);

describe("Inspection API", () => {
  let inspectionId;

  afterAll(() => {
    // Clear in-memory DB after tests
    db.inspections = {};
  });

  test("Create inspection", async () => {
    const res = await request(app).post("/api/inspections").send();
    expect(res.statusCode).toBe(200);
    expect(res.body.inspectionId).toBeDefined();
    inspectionId = res.body.inspectionId;
  });

  test("Upload photo without inspection returns 404", async () => {
    const res = await request(app)
      .post("/api/inspections/invalid_id/photos")
      .attach("file", Buffer.from("test"), "test.jpg");
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/inspection not found/i);
  });

  test("Upload photo with valid inspection", async () => {
    const res = await request(app)
      .post(`/api/inspections/${inspectionId}/photos`)
      .field("side", "front")
      .field("type", "pickup")
      .attach("file", Buffer.from("fake-image-data"), "test.jpg");
    expect(res.statusCode).toBe(200);
    expect(res.body.photoId).toBeDefined();
  });

  test("Get results for valid inspection", async () => {
    const res = await request(app).get(`/api/inspections/${inspectionId}/results`);
    expect(res.statusCode).toBe(200);
    expect(res.body.inspectionId).toBe(inspectionId);
    expect(Array.isArray(res.body.photos)).toBe(true);
  });

  test("Get results for invalid inspection", async () => {
    const res = await request(app).get("/api/inspections/invalid_id/results");
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
