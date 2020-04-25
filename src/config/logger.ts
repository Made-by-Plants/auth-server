import pino from "pino";

export const logger = pino({
  name: "ket-auth-server",
  level: "debug",
  prettyPrint: process.env.NODE_ENV === "development",
});
