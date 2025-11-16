import { v4 as uuid } from "uuid";
import { db } from "../utils/memoryStore.js";
import { analyzeDamage } from "../services/ai.service.js";
import { createCanvas, loadImage } from "canvas";
import ServiceError from "../errors/serviceError.js";

// ----------------------- CREATE INSPECTION -----------------------
export const createInspection = (req, res, next) => {
  try {
    const id = "ins_" + uuid();

    db.inspections[id] = {
      id,
      photos: [],
      results: null,
      createdAt: Date.now(),
    };

    res.json({ inspectionId: id });
  } catch (err) {
    next(err);
  }
};

// ----------------------- UPLOAD PHOTO -----------------------
export const uploadPhoto = (req, res, next) => {
  try {
    const { id } = req.params;
    const inspection = db.inspections[id];
    if (!inspection) throw new ServiceError("Inspection not found", 404);

    const file = req.file;
    if (!file) throw new ServiceError("No file uploaded", 400);

    const { side = "unknown", type = "pickup" } = req.body;

    const photoId = "p_" + uuid();
    const base64 = file.buffer.toString("base64");
    const url = `data:${file.mimetype};base64,${base64}`;

    const photo = { photoId, side, type, url };
    inspection.photos.push(photo);

    res.json(photo);
  } catch (err) {
    next(err);
  }
};

// ----------------------- ANALYZE INSPECTION -----------------------
export const analyzeInspection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inspection = db.inspections[id];
    if (!inspection) throw new ServiceError("Inspection not found", 404);

    const pickupPhotos = inspection.photos.filter((p) => p.type === "pickup");
    const returnPhotos = inspection.photos.filter((p) => p.type === "return");

    const issues = [];

    for (let r of returnPhotos) {
      const p = pickupPhotos.find((x) => x.side === r.side);
      if (!p) continue;

      const result = await analyzeDamage(r.url);
      if (!result) continue;

      result.forEach((obj) => {
        const { xmin, ymin, xmax, ymax } = obj.box;
        const width = xmax - xmin;
        const height = ymax - ymin;
        const area = width * height;

        const baseCosts = {
          scratch: 100,
          dent: 400,
          crack: 600,
        };
        const baseCost = baseCosts[obj.label] ?? 300;

        let severityMultiplier = 1;
        if (obj.score > 0.85) severityMultiplier = 2;
        else if (obj.score > 0.65) severityMultiplier = 1.5;
        else if (obj.score > 0.4) severityMultiplier = 1.2;

        const sizeMultiplier = Math.min(Math.max(area * 2000, 0.5), 3);

        const estimatedCost = baseCost * severityMultiplier * sizeMultiplier;

        issues.push({
          id: "iss_" + uuid(),
          label: obj.label,
          confidence: obj.score,
          severity: obj.score > 0.7 ? "major" : "minor",
          boundingBox: obj.box,
          photoId: r.photoId,
          estimatedCost: Math.round(estimatedCost),
        });
      });
    }

    const totalCost = issues.reduce((sum, issue) => sum + issue.estimatedCost, 0);

    inspection.results = {
      issues,
      summary: {
        totalEstimatedCost: totalCost,
      },
    };

    res.json({ status: "done", results: inspection.results });
  } catch (err) {
    next(err);
  }
};

// ----------------------- ANNOTATE IMAGE -----------------------
export const annotateInspectionImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inspection = db.inspections[id];
    if (!inspection) throw new ServiceError("Inspection not found", 404);

    const returnPhotos = inspection.photos.filter((p) => p.type === "return");
    if (returnPhotos.length === 0)
      throw new ServiceError("No return photos found", 400);

    if (!inspection.results)
      throw new ServiceError("No analysis results found", 400);

    const photo = returnPhotos[0];

    const image = await loadImage(photo.url);

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0, image.width, image.height);

    const issues = inspection.results.issues.filter(
      (i) => i.photoId === photo.photoId
    );

    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;

    issues.forEach(({ boundingBox }) => {
      if (!boundingBox) return;
      const { xmin, ymin, xmax, ymax } = boundingBox;

      const centerX = ((xmin + xmax) / 2) * image.width;
      const centerY = ((ymin + ymax) / 2) * image.height;
      const radiusX = ((xmax - xmin) / 2) * image.width;
      const radiusY = ((ymax - ymin) / 2) * image.height;
      const radius = Math.max(radiusX, radiusY);

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius, radius, 0, 0, Math.PI * 2);
      ctx.stroke();
    });

    const annotatedBase64 = canvas.toDataURL();

    res.json({
      annotatedImage: annotatedBase64,
      totalEstimatedCost: inspection.results.summary.totalEstimatedCost,
    });
  } catch (err) {
    next(err);
  }
};

// ----------------------- GET RESULTS -----------------------
export const getResults = (req, res, next) => {
  try {
    const { id } = req.params;
    const inspection = db.inspections[id];
    if (!inspection) throw new ServiceError("Inspection not found", 404);

    res.json({
      inspectionId: id,
      photos: inspection.photos,
      results: inspection.results,
    });
  } catch (err) {
    next(err);
  }
};
