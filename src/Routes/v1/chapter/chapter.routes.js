import express from 'express';
import chapterController from '../../../Controllers/chapter.controller.js';
import { isAdmin } from '../../../Middlewares/auth.middleware.js';
import upload from '../../../Middlewares/upload.middleware.js';

const router = express.Router();

router.get('/', chapterController.getAllChapters);
router.get('/:id', chapterController.getChapterById);
router.post('/', isAdmin, upload.single('file'), chapterController.uploadChapters);

export default router;