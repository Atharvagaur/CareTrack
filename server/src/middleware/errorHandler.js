/**
 * 404 handler for requests that matched no route.
 */
export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

/**
 * Centralized error handler. Always registered last in app.js.
 */
export function errorHandler(err, _req, res, _next) {
  let statusCode = Number(err.statusCode || err.status) || 0;
  let details;

  if (!statusCode) {
    if (err.name === 'ValidationError' && err.errors) {
      statusCode = 400;
      details = Object.values(err.errors).map((validationError) => ({
        path: validationError.path,
        message: validationError.message,
      }));
    } else if (err.name === 'CastError') {
      statusCode = 400;
      details = [{ path: err.path, message: `Invalid value for ${err.path}` }];
    } else if (err.code === 11000) {
      statusCode = 409;
    } else {
      statusCode = 500;
    }
  }

  if (err.name === 'ZodError' && Array.isArray(err.issues)) {
    details = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  }

  const isServerError = statusCode >= 500;

  if (isServerError) {
    console.error('[error]', err);
  }

  const body = {
    success: false,
    error: {
      message: isServerError && process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message || 'Something went wrong',
      statusCode,
    },
  };

  if (details) {
    body.error.details = details;
  }

  res.status(statusCode).json(body);
}
