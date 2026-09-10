import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../validators/authValidators.js';

const router = express.Router();

router.use(protect);

router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
router.get('/dashboard-stats', userController.getDashboardStats);

export default router;
