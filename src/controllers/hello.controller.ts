import { Request, Response } from "express";

require("dotenv").config();

export class HelloController {
  helloWorld = (req: Request, res: Response) => {
    res.send("Hello World!");
  };
}
