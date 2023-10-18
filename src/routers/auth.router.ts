import { Express, Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { loginMiddleware } from "../middlewares/auth.middlewares";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../middlewares/validation.middlwares";

export class AuthRouter {
  public app: Express;

  authController: AuthController;
  authRouter: Router;

  constructor(app: Express) {
    this.app = app;
    this.authController = new AuthController();
    this.authRouter = Router();
  }

  authRoutes = () => {
    this.authRouter.post(
      "/register",
      validateRegisterInput,
      this.authController.register
    );
    this.authRouter.post(
      "/login",
      validateLoginInput,
      loginMiddleware,
      this.authController.login
    );

    this.app.use("/api/v1/auth", this.authRouter);
  };

  authRouterConfig = () => {
    this.authRoutes();
  };
}
