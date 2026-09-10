import express from 'express';
import * as coverLetterController from '../controllers/coverLetterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require auth on all routes
router.use(protect);

router.post('/generate-text', coverLetterController.generateCoverLetterText);
router.get('/', coverLetterController.getCoverLetters);
router.post('/', coverLetterController.createNewCoverLetter);

router.get('/:id', coverLetterController.getSingleCoverLetter);
router.put('/:id', coverLetterController.updateSingleCoverLetter);
router.delete('/:id', coverLetterController.deleteSingleCoverLetter);
router.get('/:id/pdf', coverLetterController.downloadCoverLetterPdf);

export default router;
