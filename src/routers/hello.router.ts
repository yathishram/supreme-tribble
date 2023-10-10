import express, { Express, Router } from "express";
import { HelloController } from "../controllers/hello.controller";

export class HelloRouter {
  app: Express;

  helloController: HelloController;
  helloRouter: Router;

  constructor(app: Express) {
    this.app = app;
    this.helloController = new HelloController();
    this.helloRouter = Router();
  }

  helloRoutes = () => {
    this.helloRouter.get("/hello", this.helloController.helloWorld);

    this.app.use("/api/v1", this.helloRouter);
  };

  helloRouterConfig = () => {
    this.helloRoutes();
  };
}
