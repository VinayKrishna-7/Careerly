import * as authService from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { setTokenCookie, clearTokenCookie } from '../utils/jwt.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, safetyPin } = req.body;
    const { user, token } = await authService.registerUser({ name, email, password, safetyPin });

    setTokenCookie(res, token);

    return sendSuccess(
      res,
      'Account created successfully',
      { user, token },
      201
    );
  } catch (error) {
    next(error);
  }
};

export const resetPasswordWithPin = async (req, res, next) => {
  try {
    const { email, safetyPin, newPassword } = req.body;
    const { user, token } = await authService.resetPasswordWithSafetyPin({ email, safetyPin, newPassword });

    setTokenCookie(res, token);

    return sendSuccess(
      res,
      'Password reset successfully using your Safety PIN!',
      { user, token },
      200
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser({ email, password });

    setTokenCookie(res, token);

    return sendSuccess(
      res,
      'Logged in successfully',
      { user, token },
      200
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    clearTokenCookie(res);
    return sendSuccess(res, 'Logged out successfully', null, 200);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user._id);
    return sendSuccess(res, 'Current user profile fetched', { user }, 200);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.requestPasswordReset(email);
    return sendSuccess(res, result.message, result, 200);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;
    const { user, token } = await authService.resetUserPassword(resetToken, password);

    setTokenCookie(res, token);

    return sendSuccess(
      res,
      'Password reset successful. You are now logged in.',
      { user, token },
      200
    );
  } catch (error) {
    next(error);
  }
};
