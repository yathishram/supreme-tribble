import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { users } from "../db/users.db";
import bcrypt from "bcrypt";
import { CommonTypes } from "../types/common.types";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const loginMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  // Find the user in the database
  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(401).json({ message: "Invalid Username" });
  }

  // Compare the provided password with the stored hashed password
  bcrypt.compare(password, user.password, (err, passwordMatch) => {
    if (err || !passwordMatch) {
      return res.status(401).json({ message: "Invalid Password" });
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
    return res.status(401).json({ message: "No token provided" });
  }

  // Get the user information from the token

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = users.find(
      (user) =>
        user.username === (decoded as CommonTypes.JwtUserPayload)?.username
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Store user information and token in the request object
    req.user = user as CommonTypes.User;

    next();
  });
};
