import { logger } from "./logger.service";

const axios = require("axios");
const NodeCache = require("node-cache");
const cron = require("node-cron");
require("dotenv").config();

const myCache = new NodeCache();

export class NewsService {
  apiKey: string = process.env.NEWS_API_KEY!;

  async fetchNewsArticlesForPreference(userId: string, preference: string) {
    let articles = myCache.get(`${userId}-${preference}`);

    if (!articles) {
      try {
        const response = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q: preference,
            apiKey: this.apiKey,
          },
        });

        articles = response.data.articles;

        // Cache the articles with a TTL of 10 minutes
        myCache.set(`${userId}-${preference}`, articles, 600);

        logger.info(`Cached news articles for preference: ${preference}`);
      } catch (error: any) {
        logger.error(
          `Error fetching news articles for ${preference}: ${error.message}`
        );
      }
    } else {
      logger.info(
        `Fetched news articles from cache for preference: ${preference}`
      );
    }

    return {
      [preference]: articles,
    };
  }

  async fetchNewsArticles(userId: string, preferences: string[]) {
    const newsPromises = preferences.map((preference) =>
      this.fetchNewsArticlesForPreference(userId, preference)
    );
    const newsData = await Promise.all(newsPromises);

    return Object.assign({}, ...newsData);
  }

  scheduleCacheUpdate(
    fetchAllPreferencesFunc: () => { userId: string; preferences: string[] }[]
  ) {
    cron.schedule("*/10 * * * *", async () => {
      const allUserPreferences = fetchAllPreferencesFunc();
      for (const userPreference of allUserPreferences) {
        const { userId, preferences } = userPreference;
        for (const preference of preferences) {
          await this.fetchNewsArticlesForPreference(userId, preference);
        }
      }
    });

    logger.info("Scheduled cache updates for news articles.");
  }
}
