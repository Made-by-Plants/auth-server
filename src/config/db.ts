import {
  createConnection as typeormCreateConnection,
  Connection,
} from "typeorm";

import { User } from "../user/user.entity";
import { Role } from "../role/role.entity";

export function createConnection(): Promise<Connection> {
  return typeormCreateConnection({
    type: "postgres",
    uuidExtension: "pgcrypto",
    url: process.env.DATABASE_URL,
    entities: [User, Role],
    logging: "all",
  });
}
