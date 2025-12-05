export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }

  // 400
  static badRequest(message = "Bad Request", details = null) {
    return new ApiError(400, message, details);
  }

  // 401
  static unauthorized(message = "Unauthorized", details = null) {
    return new ApiError(401, message, details);
  }

  // 403
  static forbidden(message = "Forbidden", details = null) {
    return new ApiError(403, message, details);
  }

  // 404
  static notFound(message = "Not Found", details = null) {
    return new ApiError(404, message, details);
  }

  // 409
  static conflict(message = "Conflict", details = null) {
    return new ApiError(409, message, details);
  }

  // 500
  static internal(message = "Internal Server Error", details = null) {
    return new ApiError(500, message, details);
  }
}

export const apiErrorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);

  const status = err.statusCode ?? 500;

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    details: err.details || null,
  });
};
