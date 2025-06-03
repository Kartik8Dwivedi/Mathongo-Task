import express from 'express';

import chapterRoutes from './chapter/chapter.routes.js';

const router = express.Router();

router.use('/chapters', chapterRoutes);

export default router;