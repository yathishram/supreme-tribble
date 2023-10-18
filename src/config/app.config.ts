import { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import session from "express-session";

require("dotenv").config();

export class AppConfig {
  app: Express;
  passport: any;

  constructor(app: Express) {
    this.app = app;
  }

  setAppConfig() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.set("trust proxy", 1);
    this.app.use(
      session({
        secret: process.env.JWT_SECRET!,
        resave: false,
        saveUninitialized: false,
      })
    );
  }

  includeConfig() {
    this.setAppConfig();
  }
}
