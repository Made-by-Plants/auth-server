import { getNullLogger } from "../config/logger";
import { createServer } from "../server";
import { createConnection } from "../config/db";
import { AddressInfo } from "net";
import axios, { AxiosInstance } from "axios";
import { Connection } from "typeorm";

export interface ITestWorld {
  client: AxiosInstance;
  connection: Connection;
  close: () => Promise<void>;
}

export async function bootstrapTestServer(): Promise<ITestWorld> {
  return new Promise((resolve, reject) => {
    createConnection()
      .then((connection) => {
        const app = createServer(getNullLogger());
        const listener = app.listen(0, () => {
          const closeServer = async () => {
            listener.close();
            await connection.close();
          };
          const serverPort = (listener.address() as AddressInfo).port;
          const client = axios.create({
            baseURL: `http://localhost:${serverPort}/`,
          });
          resolve({ connection, client, close: closeServer });
        });
      })
      .catch(reject);
  });
}
