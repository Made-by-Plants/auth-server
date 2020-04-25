import pino from "pino";

export function getLogger(destination?: pino.DestinationStream): pino.Logger {
  return pino(
    destination ?? {
      name: "ket-auth-server",
      level: "debug",
      prettyPrint: process.env.NODE_ENV !== "production",
    }
  );
}

export function getNullLogger(): pino.Logger {
  return getLogger(pino.destination("/dev/null"));
}

export const logger = getLogger();
