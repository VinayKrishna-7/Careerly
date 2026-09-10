import crypto from 'crypto';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

const validateStrictPassword = (password) => {
  if (!password || typeof password !== 'string') {
    const error = new Error('Password is required');
    error.statusCode = 400;
    throw error;
  }
  if (password.length < 8) {
    const error = new Error('Password must be at least 8 characters long');
    error.statusCode = 400;
    throw error;
  }
  if (!/[A-Z]/.test(password)) {
    const error = new Error('Password must contain at least one uppercase letter (A-Z)');
    error.statusCode = 400;
    throw error;
  }
  if (!/[a-z]/.test(password)) {
    const error = new Error('Password must contain at least one lowercase letter (a-z)');
    error.statusCode = 400;
    throw error;
  }
  if (!/[0-9]/.test(password)) {
    const error = new Error('Password must contain at least one number (0-9)');
    error.statusCode = 400;
    throw error;
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    const error = new Error('Password must contain at least one special character (!@#$%^&*...)');
    error.statusCode = 400;
    throw error;
  }
};

export const registerUser = async ({ name, email, password, safetyPin }) => {
  const normalizedEmail = (email || '').toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error('This email address is already registered. Please sign in instead.');
    error.statusCode = 400;
    error.code = 'EMAIL_ALREADY_EXISTS';
    throw error;
  }

  validateStrictPassword(password);

  const cleanSafetyPin = (safetyPin || '1234').toString().trim();
  if (!/^\d{4,6}$/.test(cleanSafetyPin)) {
    const error = new Error('Safety PIN must be a 4 to 6 digit numeric code.');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: password,
    safetyPin: cleanSafetyPin
  });

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      jobTitle: user.jobTitle,
      safetyPin: user.safetyPin,
      createdAt: user.createdAt
    },
    token
  };
};

export const resetPasswordWithSafetyPin = async ({ email, safetyPin, newPassword }) => {
  const normalizedEmail = (email || '').toLowerCase().trim();
  if (!normalizedEmail || !safetyPin || !newPassword) {
    const error = new Error('Please provide email, safety PIN, and new password.');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    const error = new Error('No account found with this email address. Please check the email.');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  const providedPin = safetyPin.toString().trim();
  if (user.safetyPin !== providedPin) {
    const error = new Error('Incorrect Safety PIN code! Password cannot be reset without the matching PIN code you chose during registration.');
    error.statusCode = 400;
    error.code = 'INVALID_SAFETY_PIN';
    throw error;
  }

  validateStrictPassword(newPassword);

  user.passwordHash = newPassword;
  await user.save();

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      jobTitle: user.jobTitle,
      safetyPin: user.safetyPin,
      createdAt: user.createdAt
    },
    token
  };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = (email || '').toLowerCase().trim();
  if (!normalizedEmail || !password) {
    const error = new Error('Please provide both email and password.');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
  if (!user) {
    const error = new Error('No account found with this email. Please sign up to create an account.');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Incorrect password. Please verify your password and try again.');
    error.statusCode = 401;
    error.code = 'INVALID_PASSWORD';
    throw error;
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      jobTitle: user.jobTitle,
      createdAt: user.createdAt
    },
    token
  };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    jobTitle: user.jobTitle,
    createdAt: user.createdAt
  };
};

export const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    // Return success simulation to avoid user enumeration
    return {
      message: 'If that email address is in our database, we will send a password reset link.'
    };
  }

  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // In production, send email via nodemailer/SendGrid. For local dev/demo, we return the token info in log.
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
  console.log(`\n======================================================`);
  console.log(`[PASSWORD RESET SIMULATOR]`);
  console.log(`To: ${email}`);
  console.log(`Reset Token: ${resetToken}`);
  console.log(`Reset URL: ${resetUrl}`);
  console.log(`======================================================\n`);

  return {
    message: 'Password reset link sent to your email.',
    resetToken,
    resetUrl
  };
};

export const resetUserPassword = async (resetToken, newPassword) => {
  validateStrictPassword(newPassword);

  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    const error = new Error('Invalid or expired password reset token');
    error.statusCode = 400;
    throw error;
  }

  user.passwordHash = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      jobTitle: user.jobTitle
    },
    token
  };
};

export const updateUserProfile = async (userId, data) => {
  const user = await User.findById(userId).select('+passwordHash');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (data.name) user.name = data.name;
  if (data.avatar !== undefined) user.avatar = data.avatar;
  if (data.jobTitle !== undefined) user.jobTitle = data.jobTitle;
  if (data.safetyPin !== undefined && /^\d{4,6}$/.test(data.safetyPin.trim())) {
    user.safetyPin = data.safetyPin.trim();
  }

  if (data.newPassword) {
    validateStrictPassword(data.newPassword);

    if (!data.currentPassword) {
      const error = new Error('Current password is required to set a new password');
      error.statusCode = 400;
      throw error;
    }

    const isMatch = await user.matchPassword(data.currentPassword);
    if (!isMatch) {
      const error = new Error('Current password does not match');
      error.statusCode = 400;
      throw error;
    }

    user.passwordHash = data.newPassword;
  }

  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    jobTitle: user.jobTitle,
    createdAt: user.createdAt
  };
};
