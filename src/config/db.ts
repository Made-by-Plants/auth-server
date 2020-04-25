import {
  createConnection as typeormCreateConnection,
  Connection,
} from "typeorm";

import { User } from "../user/user.entity";
import { Role } from "../role/role.entity";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export function createConnection(
  connectionOptions?: Partial<PostgresConnectionOptions>
): Promise<Connection> {
  return typeormCreateConnection({
    type: "postgres",
    uuidExtension: "pgcrypto",
    url: process.env.DATABASE_URL,
    entities: [User, Role],
    logging: "all",
    ...connectionOptions,
  });
}
