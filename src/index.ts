import dotenv from "dotenv";
import pino from "pino";
import { createConnection } from "typeorm";
import { User } from "./user/user.entity";
import { createServer } from "./server";
import { Role } from "./role/role.entity";

dotenv.config();

const logger = pino({
  name: "ket-auth-server",
  level: "debug",
  prettyPrint: process.env.NODE_ENV === "development",
});

createConnection({
  type: "postgres",
  uuidExtension: "pgcrypto",
  url: process.env.DATABASE_URL,
  entities: [User, Role],
  logging: "all",
})
  .then((connection) => {
    const app = createServer(logger);
    app.listen(app.get("port"), () => {
      logger.info(
        "App is running at http://localhost:%d in %s mode.",
        app.get("port"),
        app.get("env")
      );
    });
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
