import { createServer } from "./server";
import { logger } from "./config/logger";
import { createConnection } from "./config/db";

const handleErorr = (error: Error): never => {
  logger.error(error);
  process.exit(1);
};

(async () => {
  await createConnection();
  const app = createServer(logger);
  return app.listen(app.get("port"), () =>
    logger.info(
      "Auth server is running at http://%s:%d in %s mode.",
      app.get("host"),
      app.get("port"),
      app.get("env")
    )
  );
})().catch(handleErorr);
