import { Response } from "express";

export class AppResponseService {
  // Successful response
  sendSuccess(
    res: Response,
    data: any,
    message = "Operation successful.",
    statusCode = 200
  ) {
    res.status(statusCode).json({
      status: "success",
      message,
      data,
    });
  }

  // Error response
  sendError(res: Response, message: string, statusCode = 500) {
    res.status(statusCode).json({
      status: "error",
      message,
    });
  }

  // Not found response
  sendNotFound(res: Response, message = "Resource not found.") {
    this.sendError(res, message, 404);
  }

  // Validation error response
  sendValidationError(res: Response, errors: any[]) {
    res.status(400).json({
      status: "fail",
      errors,
    });
  }

  // Unauthorized error response
  sendUnauthorizedError(res: Response, message = "Unauthorized.") {
    this.sendError(res, message, 401);
  }

  // Forbidden error response
  sendForbiddenError(res: Response, message = "Forbidden.") {
    this.sendError(res, message, 403);
  }

  sendAlreadyExistsError(res: Response, message = "Already exists.") {
    this.sendError(res, message, 409);
  }
}
