import { Request, Response } from "express";
import { users } from "../db/users.db";
import axios from "axios"; // Import Axios
import { NewsService } from "../services/news.cache.service";
import { AppResponseService } from "../services/app-response.service";
import { logger } from "../services/logger.service";

require("dotenv").config();

export class NewsController {
  private newsService: NewsService = new NewsService();
  private appResponseService: AppResponseService = new AppResponseService();
  /**
   *  Get the user's preferences
   * @param req
   * @param res
   * @returns  User's preferences
   */
  getPreferences = (req: Request, res: Response) => {
    try {
      const { username } = req.user as any;
      const user = users.find((user) => user.username === username);
      if (user) {
        return this.appResponseService.sendSuccess(
          res,
          {
            preferences: user.preferences,
          },
          "Preferences retrieved successfully",
          200
        );
      } else {
        return this.appResponseService.sendNotFound(res, "User not found");
      }
    } catch (err) {
      logger.error(err);
      return this.appResponseService.sendError(
        res,
        `
                Error while getting preferences ${err}
                `
      );
    }
  };

  /**
   *  Update the user's preferences
   * @param req
   * @param res
   * @returns  Updated user's preferences
   */
  updatePreferences = (req: Request, res: Response) => {
    try {
      const { username } = req.user as any;
      const user = users.find((user) => user.username === username);
      if (user) {
        // Take old preferences and update them with the new preferences
        user.preferences = [...user.preferences, ...req.body.preferences];
        // Update the user's preferences
        return this.appResponseService.sendSuccess(
          res,
          {
            preferences: user.preferences,
          },
          "Preferences updated successfully",
          200
        );
      } else {
        return this.appResponseService.sendNotFound(res, "User not found");
      }
    } catch (err) {
      logger.error(err);
      return this.appResponseService.sendError(
        res,
        `
                Error while updating preferences ${err}
                `
      );
    }
  };

  /**
   *  Get the news based on the user's preferences
   * @param req
   * @param res
   * @returns  News based on the user's preferences
   */
  getNews = async (req: Request, res: Response) => {
    try {
      const { username } = req.user as any;
      const user = users.find((user) => user.username === username);

      if (!user) {
        return this.appResponseService.sendNotFound(res, "User not found");
      }

      if (user.preferences.length === 0) {
        const defaultNewsResponse = await axios.get(
          "https://newsapi.org/v2/everything",
          {
            params: {
              q: "technology",
              language: "en",
              apiKey: process.env.NEWS_API_KEY,
            },
          }
        );

        return this.appResponseService.sendSuccess(
          res,
          {
            news: defaultNewsResponse.data.articles,
          },
          "News retrieved successfully",
          200
        );
      }

      const newsData = await this.newsService.fetchNewsArticles(
        user.id,
        user.preferences
      );

      return this.appResponseService.sendSuccess(
        res,
        {
          news: newsData,
        },
        "News retrieved successfully",
        200
      );
    } catch (err) {
      logger.error(err);
      return this.appResponseService.sendError(
        res,
        `
                Error while getting news ${err}
                `
      );
    }
  };

  /**
   *  Search for news based on the query
   * @param req
   * @param res
   * @returns  News based on the query
   */
  searchNews = async (req: Request, res: Response) => {
    try {
      const { search } = req.params;

      if (!search) {
        return this.appResponseService.sendError(
          res,
          "Please provide a search query"
        );
      }

      const newsResponse = await axios.get(
        "https://newsapi.org/v2/everything",
        {
          params: {
            q: search,
            apiKey: process.env.NEWS_API_KEY, // Replace with your News API key
          },
        }
      );

      return this.appResponseService.sendSuccess(
        res,
        {
          news: newsResponse.data.articles,
        },
        "News retrieved successfully",
        200
      );
    } catch (err) {
      logger.error(err);
      return this.appResponseService.sendError(
        res,
        `
                Error while searching news ${err}
                `
      );
    }
  };

  /**
   *  Add favorites to the user's favorites
   * @param req
   * @param res
   * @returns  Updated user's favorites
   */
  addFavorites = async (req: Request, res: Response) => {
    try {
      const { username } = req.user as any;
      const user = users.find((user) => user.username === username);
      if (user) {
        user.favorites = [...user.favorites, ...req.body.favorites];
        return this.appResponseService.sendSuccess(
          res,
          {
            favorites: user.favorites,
          },
          "Favorites updated successfully",
          200
        );
      } else {
        return this.appResponseService.sendNotFound(res, "User not found");
      }
    } catch (err) {
      logger.error(err);
      return this.appResponseService.sendError(
        res,
        `
                Error while updating favorites ${err}
                `
      );
    }
  };

  /**
   *  Get the user's favorites
   * @param req
   * @param res
   * @returns   User's favorites
   */
  getFavorites = (req: Request, res: Response) => {
    try {
      const { username } = req.user as any;
      const user = users.find((user) => user.username === username);
      if (user) {
        return this.appResponseService.sendSuccess(
          res,
          {
            favorites: user.favorites,
          },
          "Favorites retrieved successfully",
          200
        );
      } else {
        return this.appResponseService.sendNotFound(res, "User not found");
      }
    } catch (err) {
      logger.error(err);
      return this.appResponseService.sendError(
        res,
        `
                Error while getting favorites ${err}
                `
      );
    }
  };

  /**
   *  Add read news to the user's read news
   * @param req
   * @param res
   * @returns  Updated user's read news
   */
  addReadNews = async (req: Request, res: Response) => {
    try {
      const { username } = req.user as any;
      const user = users.find((user) => user.username === username);
      if (user) {
        user.read = [...user.read, ...req.body.read];
        return this.appResponseService.sendSuccess(
          res,
          {
            read: user.read,
          },
          "Read updated successfully",
          200
        );
      } else {
        return this.appResponseService.sendNotFound(res, "User not found");
      }
    } catch (err) {
      logger.error(err);
      return this.appResponseService.sendError(
        res,
        `
                Error while updating read ${err}
                `
      );
    }
  };

  /**
   *  Get the user's read news
   * @param req
   * @param res
   * @returns   User's read news
   */
  getReadNews = (req: Request, res: Response) => {
    try {
      const { username } = req.user as any;
      const user = users.find((user) => user.username === username);
      if (user) {
        return this.appResponseService.sendSuccess(
          res,
          {
            read: user.read,
          },
          "Read retrieved successfully",
          200
        );
      } else {
        return this.appResponseService.sendNotFound(res, "User not found");
      }
    } catch (err) {
      logger.error(err);
      return this.appResponseService.sendError(
        res,
        `
                Error while getting read ${err}
                `
      );
    }
  };
}
