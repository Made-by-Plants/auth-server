import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoMiddleware from "pino-http";
import pino from "pino";
import passport from "passport";

import { useExpressServer } from "routing-controllers";
import { UserController } from "./user/user.controller";

export function createServer(logger: pino.Logger) {
  const app = express();

  app.set("host", process.env.HOST ?? "0.0.0.0");
  app.set("port", process.env.PORT ?? 7000);
  app.set("json spaces", 2);
  app.use(pinoMiddleware({ logger }));
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(express.static("public"));

  useExpressServer(app, {
    controllers: [UserController],
    currentUserChecker: (action) => action.request.user,
  });

  return app;
}
