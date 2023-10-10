import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { users } from "../db/users.db";
import bcrypt from "bcrypt";

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

    // Generate a JWT token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

    // Store user information and token in the request object
    req.user = user;

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

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = decoded; // Store user information in the request object
    next();
  });
};

// Middleware for checking if a user exists
export const checkUserExists = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.body;

  // Check if the user exists in your database
  const userExists = users.some((user) => user.username === username);

  if (!userExists) {
    return res.status(404).json({ message: "User not found" });
  }

  next();
};
