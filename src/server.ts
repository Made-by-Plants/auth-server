import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoMiddleware from "pino-http";
import pino from "pino";
import passport from "passport";
import { AppRoutes } from "./routes";
import { createConnection } from "typeorm";
import { User } from "./user/user.entity";

import { useExpressServer } from "routing-controllers";
import { UserController } from "./user/user.controller";
export function createServer(logger: pino.Logger) {
  const app = express();

  app.set("host", "0.0.0.0");
  app.set("port", process.env.PORT ?? 7000);
  app.set("json spaces", 2);
  app.use(pinoMiddleware({ logger }));
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(passport.initialize());
  app.use(passport.session());

  useExpressServer(app, { controllers: [UserController] });

  AppRoutes.forEach((route) => {
    app[route.method](
      route.path,
      route.validations,
      async (req, res, _next) => {
        try {
          await route.implementation(req, res);
        } catch (error) {
          req.log.error(error);
          res.status(500).json({ errors: "INTERNAL SERVER ERROR" });
        }
      }
    );
  });

  return app;
}
