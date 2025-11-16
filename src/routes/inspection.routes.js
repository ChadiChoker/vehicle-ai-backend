import { Router } from "express";
import multer from "multer";
import {
  createInspection,
  uploadPhoto,
  analyzeInspection,
  getResults,
  annotateInspectionImage,
} from "../controllers/inspection.controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /inspections:
 *   post:
 *     summary: Create a new inspection
 *     tags:
 *       - Inspections
 *     responses:
 *       200:
 *         description: Inspection created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inspectionId:
 *                   type: string
 *                   example: ins_123abc
 */
router.post("/", createInspection);

/**
 * @swagger
 * /inspections/{id}/photos:
 *   post:
 *     summary: Upload a photo for an inspection
 *     tags:
 *       - Inspections
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Inspection ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               side:
 *                 type: string
 *                 description: Side of the vehicle (e.g., front, left)
 *               type:
 *                 type: string
 *                 description: Photo type (pickup or return)
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 photoId:
 *                   type: string
 *                   example: p_123abc
 *                 side:
 *                   type: string
 *                 type:
 *                   type: string
 *                 url:
 *                   type: string
 *                   format: uri
 */
router.post("/:id/photos", upload.single("file"), uploadPhoto);

/**
 * @swagger
 * /inspections/{id}/analyze:
 *   post:
 *     summary: Analyze the inspection photos using AI
 *     tags:
 *       - Inspections
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Inspection ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analysis completed with results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: done
 *                 results:
 *                   type: object
 */
router.post("/:id/analyze", analyzeInspection);

/**
 * @swagger
 * /inspections/{id}/results:
 *   get:
 *     summary: Get inspection photos and analysis results
 *     tags:
 *       - Inspections
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Inspection ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns inspection details with photos and results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inspectionId:
 *                   type: string
 *                 photos:
 *                   type: array
 *                   items:
 *                     type: object
 *                 results:
 *                   type: object
 */
router.get("/:id/results", getResults);

/**
 * @swagger
 * /inspections/{id}/annotate:
 *   get:
 *     summary: Get annotated inspection image with damage circles and costs
 *     tags:
 *       - Inspections
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Inspection ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns annotated image and total estimated cost
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 annotatedImage:
 *                   type: string
 *                   format: uri
 *                 totalEstimatedCost:
 *                   type: integer
 *                   example: 500
 */
router.get("/:id/annotate", annotateInspectionImage);

export default router;
