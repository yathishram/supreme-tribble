import { Express, Router } from "express";
import { verifyToken } from "../middlewares/auth.middlewares";
import { NewsController } from "../controllers/news.controller";
import { apiLimiter } from "../middlewares/rate-limiter.middleware";

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
    this.newsRouter.get(
      "",
      verifyToken,
      apiLimiter,
      this.newsController.getNews
    );

    this.newsRouter.get(
      "/preferences",
      verifyToken,
      this.newsController.getPreferences
    );

    this.newsRouter.put(
      "/preferences",
      verifyToken,
      this.newsController.updatePreferences
    );

    this.newsRouter.post(
      "/favorites",
      verifyToken,
      this.newsController.addFavorites
    );

    this.newsRouter.get(
      "/favorites",
      verifyToken,
      this.newsController.getFavorites
    );

    this.newsRouter.post("/read", verifyToken, this.newsController.addReadNews);

    this.newsRouter.get("/read", verifyToken, this.newsController.getReadNews);

    this.newsRouter.get(
      "/:search",
      verifyToken,
      this.newsController.searchNews
    );

    this.app.use("/api/v1/news", this.newsRouter);
  };

  newsRouterConfig = () => {
    this.newsRoutes();
  };
}
