import { Request, Response } from "express";
import { users } from "../db/users.db";
import axios from "axios"; // Import Axios

require("dotenv").config();

export class NewsController {
  private newsAPI: any;

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
              apiKey: process.env.NEWS_API_KEY, // Replace with your News API key
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

      const newsPromises = user.preferences.map(async (preference: string) => {
        const newsResponse = await axios.get(
          "https://newsapi.org/v2/everything",
          {
            params: {
              q: preference,
              apiKey: process.env.NEWS_API_KEY, // Replace with your News API key
            },
          }
        );

        return {
          [preference]: newsResponse.data.articles,
        };
      });

      const newsData = await Promise.all(newsPromises);

      const responseData = Object.assign({}, ...newsData);

      return res.status(200).json({
        message: "News retrieved successfully",
        data: {
          news: responseData,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error while getting news",
      });
    }
  };

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
}
