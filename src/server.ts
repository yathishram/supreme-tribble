import express, { Express } from "express";
import { AppConfig } from "./config/app.config";
import { HelloRouter } from "./routers/hello.router";
import { AuthRouter } from "./routers/auth.router";
import { NewsRouter } from "./routers/news.router";

require("dotenv").config();

export class Server {
  app: Express;
  server: any;

  constructor() {
    this.app = express();
  }

  appConfig = () => {
    new AppConfig(this.app).includeConfig();
  };

  routeConfig = () => {
    new HelloRouter(this.app).helloRouterConfig();
    new AuthRouter(this.app).authRouterConfig();
    new NewsRouter(this.app).newsRouterConfig();
  };

  startServer = () => {
    this.appConfig();
    this.routeConfig();

    this.app.get("*", (req, res) => {
      res.send("This is an invalid route.");
    });

    this.server = this.app.listen(3000, () => {
      console.log(`Server listening on port 3000`);
    });
  };

  stopServerOnControl = () => {
    process.on("SIGINT", async () => {
      console.log("Closing DB connection.");
      console.info("SIGINT signal received.");
      console.log("Closing http server.");
      this.server.close(async () => {
        console.log("Http server closed.");
        process.exit(0);
      });
    });
  };

  stopServer = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        console.error("Server is not running.");
        return reject(new Error("Server is not running."));
      }

      console.log("Closing http server.");
      this.server.close((err: any) => {
        if (err) {
          console.error("Error closing the server:", err);
          return reject(err);
        }

        console.log("Http server closed.");
        resolve();
      });
    });
  };
}
