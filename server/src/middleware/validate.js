import { sendError } from '../utils/apiResponse.js';

export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!parsed.success) {
      const errorDetails = parsed.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message
      }));

      return sendError(
        res,
        'Validation failed: ' + parsed.error.errors[0]?.message,
        400,
        errorDetails
      );
    }

    // Attach sanitized/parsed data if necessary
    req.validated = parsed.data;
    next();
  } catch (error) {
    next(error);
  }
};
