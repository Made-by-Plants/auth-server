import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoMiddleware from "pino-http";
import pino from "pino";

dotenv.config();

const logger = pino();

const app = express();
app.set("host", "0.0.0.0");
app.set("port", process.env.PORT ?? 8080);
app.set("json spaces", 2);
app.use(pinoMiddleware({ logger }));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.listen(app.get("port"), () => {
  logger.info(
    "App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
});
