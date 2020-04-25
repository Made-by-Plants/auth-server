import { getNullLogger } from "../config/logger";
import { createServer } from "../server";
import { createConnection } from "../config/db";
import { AddressInfo } from "net";
import axios, { AxiosInstance } from "axios";
import { Connection } from "typeorm";
import faker from "faker";
import { User } from "../user/user.entity";
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

export async function getFreeUsername(): Promise<string> {
  const randomName = faker.internet.email();
  const user = await User.findOne({ username: randomName });
  return user ? getFreeUsername() : randomName;
}
