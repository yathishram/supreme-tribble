import { Express, Router } from "express";
import {
  checkUserExists,
  loginMiddleware,
  verifyToken,
} from "../middlewares/auth.middlewares";
import { NewsController } from "../controllers/news.controller";

export class NewsRouter {
  app: Express;

  newsController: NewsController;
  newsRouter: Router;

  constructor(app: Express) {
    this.app = app;
    this.newsController = new NewsController();
    this.newsRouter = Router();
  }

  newsRoutes = () => {
    this.newsRouter.get("/news", verifyToken, this.newsController.getNews);
    this.newsRouter.get("/news/:search", this.newsController.searchNews);
    this.newsRouter.put(
      "/news/preferences",
      verifyToken,
      this.newsController.updatePreferences
    );
    this.newsRouter.get(
      "/news/preferences",
      verifyToken,
      this.newsController.getPreferences
    );
    this.app.use("/api/v1", this.newsRouter);
  };

  newsRouterConfig = () => {
    this.newsRoutes();
  };
}
