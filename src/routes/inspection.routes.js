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
 * tags:
 *   name: Inspections
 *   description: Vehicle inspection management APIs
 */

/**
 * @swagger
 * /inspections:
 *   post:
 *     summary: Create a new inspection
 *     tags: [Inspections]
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
 *                   example: ins_1234abcd
 */
router.post("/", createInspection);

/**
 * @swagger
 * /inspections/{id}/photos:
 *   post:
 *     summary: Upload a photo for an inspection
 *     tags: [Inspections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Inspection ID
 *         schema:
 *           type: string
 *           example: ins_1234abcd
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
 *                 description: Photo side (e.g., front, back)
 *                 example: front
 *               type:
 *                 type: string
 *                 description: Photo type (pickup or return)
 *                 example: pickup
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
 *                   example: p_5678efgh
 *                 side:
 *                   type: string
 *                 type:
 *                   type: string
 *                 url:
 *                   type: string
 */
router.post("/:id/photos", upload.single("file"), uploadPhoto);

/**
 * @swagger
 * /inspections/{id}/analyze:
 *   post:
 *     summary: Analyze inspection photos for damages
 *     tags: [Inspections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Inspection ID
 *         schema:
 *           type: string
 *           example: ins_1234abcd
 *     responses:
 *       200:
 *         description: Analysis completed successfully
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
 *                   properties:
 *                     issues:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           label:
 *                             type: string
 *                           confidence:
 *                             type: number
 *                           severity:
 *                             type: string
 *                           boundingBox:
 *                             type: object
 *                             properties:
 *                               xmin:
 *                                 type: number
 *                               ymin:
 *                                 type: number
 *                               xmax:
 *                                 type: number
 *                               ymax:
 *                                 type: number
 *                           photoId:
 *                             type: string
 *                           estimatedCost:
 *                             type: integer
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalEstimatedCost:
 *                           type: integer
 */
router.post("/:id/analyze", analyzeInspection);

/**
 * @swagger
 * /inspections/{id}/results:
 *   get:
 *     summary: Get inspection photos and analysis results
 *     tags: [Inspections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Inspection ID
 *         schema:
 *           type: string
 *           example: ins_1234abcd
 *     responses:
 *       200:
 *         description: Returns inspection photos and results
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
 *                     properties:
 *                       photoId:
 *                         type: string
 *                       side:
 *                         type: string
 *                       type:
 *                         type: string
 *                       url:
 *                         type: string
 *                 results:
 *                   type: object
 */
router.get("/:id/results", getResults);

/**
 * @swagger
 * /inspections/{id}/annotate:
 *   get:
 *     summary: Get annotated inspection image with damage highlights
 *     tags: [Inspections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Inspection ID
 *         schema:
 *           type: string
 *           example: ins_1234abcd
 *     responses:
 *       200:
 *         description: Annotated image and cost summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 annotatedImage:
 *                   type: string
 *                   description: Base64-encoded annotated image data URL
 *                 totalEstimatedCost:
 *                   type: integer
 */
router.get("/:id/annotate", annotateInspectionImage);

export default router;
