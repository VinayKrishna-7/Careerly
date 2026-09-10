import * as authService from '../services/authService.js';
import * as resumeService from '../services/resumeService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await authService.updateUserProfile(req.user._id, req.body);
    return sendSuccess(res, 'Profile updated successfully', { user: updatedUser }, 200);
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await resumeService.getUserResumeStats(req.user._id);
    return sendSuccess(res, 'Dashboard statistics fetched', stats, 200);
  } catch (error) {
    next(error);
  }
};
