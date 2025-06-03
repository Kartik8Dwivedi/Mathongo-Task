import express from 'express';
import chapterController from '../../../Controllers/chapter.controller.js';

const router = express.Router();

router.get('/', chapterController.getAllChapters);
router.get('/:id', chapterController.getChapterById);

export default router;