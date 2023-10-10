import { Express, Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import {
  checkUserExists,
  loginMiddleware,
  verifyToken,
} from "../middlewares/auth.middlewares";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../middlewares/validation.middlwares";

export class AuthRouter {
  app: Express;

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
    this.authRouter.get("/protected", verifyToken, (req, res) => {
      try {
        res.status(200).send({
          message: "You are authorized to see this message.",
        });
      } catch (err) {
        res.send(err);
      }
    });

    this.app.use("/api/v1/user", this.authRouter);
  };

  authRouterConfig = () => {
    this.authRoutes();
  };
}
