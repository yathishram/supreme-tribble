import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { users } from "../db/users.db";
import bcrypt from "bcrypt";
import { CommonTypes } from "../types/common.types";
import { AppResponseService } from "../services/app-response.service";

const JWT_SECRET = process.env.JWT_SECRET as string;

const appResponseService = new AppResponseService();

export const loginMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  // Find the user in the database
  const user = users.find((user) => user.username === username);

  if (!user) {
    return appResponseService.sendNotFound(res, "User not found");
  }

  // Compare the provided password with the stored hashed password
  bcrypt.compare(password, user.password, (err, passwordMatch) => {
    if (err || !passwordMatch) {
      return appResponseService.sendError(
        res,
        `Invalid Passwords ${err ? err : ""}`
      );
    }
    // Store user information and token in the request object
    req.user = user as CommonTypes.User;

    next();
  });
};

// Middleware for verifying JWT token
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return appResponseService.sendUnauthorizedError(res, "No token provided");
  }

  // Get the user information from the token

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return appResponseService.sendUnauthorizedError(res, "Invalid token");
    }

    const user = users.find(
      (user) =>
        user.username === (decoded as CommonTypes.JwtUserPayload)?.username
    );

    if (!user) {
      return appResponseService.sendUnauthorizedError(res, "Invalid token");
    }

    // Store user information and token in the request object
    req.user = user as CommonTypes.User;

    next();
  });
};
