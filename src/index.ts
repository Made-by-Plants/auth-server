import { createConnection } from "typeorm";
import { User } from "./user/user.entity";
import { createServer } from "./server";
import { Role } from "./role/role.entity";
import { logger } from "./config/logger";

createConnection({
  type: "postgres",
  uuidExtension: "pgcrypto",
  url: process.env.DATABASE_URL,
  entities: [User, Role],
  logging: "all",
})
  .then(() => {
    const app = createServer(logger);
    app.listen(app.get("port"), () =>
      logger.info(
        "Auth server is running at http://%s:%d in %s mode.",
        app.get("host"),
        app.get("port"),
        app.get("env")
      )
    );
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
