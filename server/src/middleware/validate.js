/**
 * Validates req[source] against a Zod schema.
 * The parsed value is exposed as req.validated (Express 5 makes req.query
 * read-only, so the request object itself is not rewritten).
 */
export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const error = new Error('Request validation failed');
      error.statusCode = 400;
      error.name = 'ZodError';
      error.issues = result.error.issues;
      return next(error);
    }

    req.validated = result.data;
    next();
  };
}
