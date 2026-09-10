import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import { sendError } from '../utils/apiResponse.js';
import { COOKIE_NAME } from '../config/constants.js';

export const protect = async (req, res, next) => {
  let token = null;

  // 1. Check cookies first
  if (req.cookies && req.cookies[COOKIE_NAME]) {
    token = req.cookies[COOKIE_NAME];
  }
  // 2. Check Authorization header fallback (Bearer <token>)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Not authorized. Please log in to access this resource.', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return sendError(res, 'User belonging to this token no longer exists.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired authentication token. Please log in again.', 401);
  }
};

export const verifyResumeOwnership = async (req, res, next) => {
  const { id } = req.params;

  try {
    const resume = await Resume.findById(id);

    if (!resume) {
      return sendError(res, 'Resume not found.', 404);
    }

    // Check if resume belongs to authenticated user
    if (resume.userId.toString() !== req.user._id.toString()) {
      return sendError(res, 'Access denied. You do not own this resume.', 403);
    }

    req.resumeDoc = resume;
    next();
  } catch (error) {
    next(error);
  }
};
