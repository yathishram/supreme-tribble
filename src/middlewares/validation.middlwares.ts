import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const validateRegisterInput = [
  // Validate username

  body("user.username").notEmpty().isLength({ min: 4, max: 20 }).trim(),
  // Validate password
  body("user.password").notEmpty().isLength({ min: 6 }).trim(),
  // Validate email
  body("user.email").notEmpty().isEmail().trim(),
  // Validate firstName
  body("user.firstName").notEmpty().isLength({ min: 2, max: 30 }).trim(),
  // Validate lastName
  body("user.lastName").notEmpty().isLength({ min: 2, max: 30 }).trim(),
  // Check for validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];

export const validateLoginInput = [
  // Define validation rules using express-validator
  body("username").notEmpty().isLength({ min: 4, max: 20 }).trim(),
  body("password").notEmpty().isLength({ min: 6 }).trim(),
  // Add more validation rules as needed
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];
