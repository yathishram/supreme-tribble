import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { users } from "../db/users.db";
import { CommonTypes } from "../types/common.types";
import { v4 as uuidv4 } from "uuid";
import { SecretManagerUtils } from "../utils/secret-manager.utils";
import { CommonConstants } from "../types/common.constants";
import { AppResponseService } from "../services/app-response.service";
import { logger } from "../services/logger.service";

export class AuthController {
  private secretManager: SecretManagerUtils;
  private appResponseService: AppResponseService;
  constructor() {
    this.secretManager = new SecretManagerUtils();
    this.appResponseService = new AppResponseService();
  }

  signJwtForUser = (user: CommonTypes.User) => {
    const token = jwt.sign(
      {
        username: user.username,

        id: user.id,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: CommonConstants.JWT_EXPIRATION,
      }
    );

    return token;
  };

  register = (req: Request, res: Response) => {
    try {
      const { user } = req.body;

      const existingUser = users.find((u) => u.username === user.username);
      if (existingUser) {
        return this.appResponseService.sendAlreadyExistsError(
          res,
          "User already exists"
        );
      }

      // Hash the password
      const hashedPassword = this.secretManager.generateHashForString(
        user.password
      );

      // Create the user
      const newUser: CommonTypes.User = {
        id: uuidv4(),
        username: user.username,
        password: hashedPassword,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        preferences: [],
        favorites: [],
        read: [],
        created_at: new Date(),
        last_login: new Date(),
      };

      // Add the user to the database
      users.push(newUser);

      // Create a JWT token
      const token = this.signJwtForUser(newUser);

      // Send the token back to the user
      return this.appResponseService.sendSuccess(
        res,
        {
          token,
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            preferences: newUser.preferences,
            favorites: newUser.favorites,
            read: newUser.read,
            created_at: newUser.created_at,
            last_login: newUser.last_login,
          },
        },
        "User created successfully",
        201
      );
    } catch (err) {
      logger.error(err);
      return this.appResponseService.sendError(
        res,
        `
        Error while registering user ${err}
      `
      );
    }
  };

  login = (req: Request, res: Response) => {
    try {
      const user = req.user as CommonTypes.User;

      const token = this.signJwtForUser(user);

      return this.appResponseService.sendSuccess(
        res,
        {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            preferences: user.preferences,
            favorites: user.favorites,
            read: user.read,
            created_at: user.created_at,
            last_login: user.last_login,
          },
        },
        "User logged in successfully",
        200
      );
    } catch (err) {
      logger.error(err);
      return this.appResponseService.sendError(
        res,
        `
        Error while logging in user ${err}
      `
      );
    }
  };
}
