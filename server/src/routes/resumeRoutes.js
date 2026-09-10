import express from 'express';
import * as resumeController from '../controllers/resumeController.js';
import * as pdfController from '../controllers/pdfController.js';
import { protect, verifyResumeOwnership } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  createResumeSchema,
  updateResumeSchema,
  renameResumeSchema
} from '../validators/resumeValidators.js';

const router = express.Router();

// All resume routes require authentication
router.use(protect);

router.get('/', resumeController.getAllResumes);
router.post('/', validate(createResumeSchema), resumeController.createResume);

// Single resume operations
router.get('/:id', verifyResumeOwnership, resumeController.getResumeById);
router.put('/:id', verifyResumeOwnership, validate(updateResumeSchema), resumeController.updateResume);
router.delete('/:id', verifyResumeOwnership, resumeController.deleteResume);
router.post('/:id/duplicate', verifyResumeOwnership, resumeController.duplicateResume);
router.patch('/:id/rename', verifyResumeOwnership, validate(renameResumeSchema), resumeController.renameResume);

// ATS scoring and Job Description matching
router.post('/:id/score', verifyResumeOwnership, resumeController.getResumeScore);

// PDF generation and HTML preview
router.get('/:id/pdf', verifyResumeOwnership, pdfController.downloadResumePdf);
router.get('/:id/html-preview', verifyResumeOwnership, pdfController.previewResumeHtml);

export default router;
