import { Request, Response } from "express";
import { users } from "../db/users.db";
import axios from "axios"; // Import Axios
import { NewsService } from "../services/news.cache.service";

require("dotenv").config();

export class NewsController {
  private newsService: NewsService = new NewsService();

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
        return res.status(200).json({
          message: "Preferences retrieved successfully",
          data: {
            preferences: user.preferences,
          },
        });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: `
                Error while getting preferences ${err}
                `,
      });
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
        return res.status(200).json({
          message: "Preferences updated successfully",
          data: {
            preferences: user.preferences,
          },
        });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: `
                Error while updating preferences ${err}
                `,
      });
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
        return res.status(404).json({ message: "User not found" });
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

        return res.status(200).json({
          message: "News retrieved successfully",
          data: {
            news: defaultNewsResponse.data.articles,
          },
        });
      }

      const newsData = await this.newsService.fetchNewsArticles(
        user.id,
        user.preferences
      );

      return res.status(200).json({
        message: "News retrieved successfully",
        data: {
          news: newsData,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error while getting news",
      });
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
        return res.status(400).json({ message: "Query is required" });
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

      return res.status(200).json({
        message: "News retrieved successfully",
        data: {
          news: newsResponse.data.articles,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error while getting news",
      });
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
        return res.status(200).json({
          message: "Favorites updated successfully",
          data: {
            favorites: user.favorites,
          },
        });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: ` 
                Error while updating favorites ${err} 
                `,
      });
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
        return res.status(200).json({
          message: "Favorites retrieved successfully",
          data: {
            favorites: user.favorites,
          },
        });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: `
                Error while getting favorites ${err}
                `,
      });
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
        return res.status(200).json({
          message: "Read updated successfully",
          data: {
            read: user.read,
          },
        });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: ` 
                Error while updating read ${err} 
                `,
      });
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
        return res.status(200).json({
          message: "Read retrieved successfully",
          data: {
            read: user.read,
          },
        });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: `
                Error while getting read ${err}
                `,
      });
    }
  };
}
