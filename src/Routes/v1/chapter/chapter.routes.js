import express from 'express';
import chapterController from '../../../Controllers/chapter.controller.js';
import { isAdmin } from '../../../Middlewares/auth.middleware.js';
import upload from '../../../Middlewares/upload.middleware.js';

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Chapters
 *   description: API endpoints for managing chapters
 */

/**
 * @swagger
 * /chapters:
 *   get:
 *     tags: [Chapters]
 *     summary: Retrieve a paginated list of chapters (with optional filters)
 *     description: |
 *       Returns a paginated list of all chapters.  
 *       Supports filtering by subject, class, unit, status, and isWeakChapter.  
 *       Caches results for 1 hour in Redis.
 *     parameters:
 *       - $ref: "#/components/parameters/SubjectParam"
 *       - $ref: "#/components/parameters/ClassParam"
 *       - $ref: "#/components/parameters/UnitParam"
 *       - $ref: "#/components/parameters/StatusParam"
 *       - $ref: "#/components/parameters/IsWeakParam"
 *       - $ref: "#/components/parameters/PageParam"
 *       - $ref: "#/components/parameters/LimitParam"
 *     responses:
 *       200:
 *         description: A list of chapters with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ChapterListResponse"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/', chapterController.getAllChapters);

/**
 * @swagger
 * /chapters/{id}:
 *   get:
 *     tags: [Chapters]
 *     summary: Retrieve a single chapter by ID
 *     description: |
 *       Returns the chapter details for the given ObjectId.  
 *       Validates that the ID is a valid Mongo ObjectId.
 *     parameters:
 *       - $ref: "#/components/parameters/ChapterIdParam"
 *     responses:
 *       200:
 *         description: Chapter found and returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ChapterDetailResponse"
 *       400:
 *         description: Invalid chapter ID supplied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Chapter not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/:id', chapterController.getChapterById);

/**
 * @swagger
 * /chapters:
 *   post:
 *     tags: [Chapters]
 *     summary: Bulk upload chapters from a JSON file (Admin only)
 *     description: |
 *       Uploads a JSON file containing an array of chapter objects.  
 *       Validates each chapter against the schema.  
 *       Inserts valid chapters and returns details of any invalid entries.  
 *       Clears Redis cache upon successful insertion.
 *     security:
 *       - ApiKeyAuth: []
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
 *                 description: JSON file containing an array of chapter objects.
 *     responses:
 *       200:
 *         description: Chapters uploaded successfully. Returns counts of inserted and failed items.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UploadResponse"
 *       400:
 *         description: Bad request (no file uploaded or invalid JSON)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       403:
 *         description: Forbidden (not an admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/', isAdmin, upload.single('file'), chapterController.uploadChapters);

export default router;