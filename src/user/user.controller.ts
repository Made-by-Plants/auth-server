import { getConnection } from "typeorm";
import { User } from "./user.entity";
import { Get, Post, JsonController } from "routing-controllers";
import rasha from "rasha";
import { publicKey } from "../config/jwt";

@JsonController()
export class UserController {
  @Get("/users")
  getAll() {
    return getConnection().manager.find(User, { relations: ["roles"] });
  }

  @Post("/login")
  public async login() {
    return {};
  }

  @Get("/jwks")
  public async jwks() {
    const jwk = {
      ...(await rasha.import({ pem: publicKey, public: true })),
      alg: "RS512",
      use: "sig",
      kid: publicKey,
    };
    return {
      keys: [jwk],
    };

    // res.setHeader("Content-Type", "application/json");
    // res.send(JSON.stringify(jwks, null, 2) + "\n");
    // handleResponse(res, 200, jwks);
  }

  // app.get('/jwks', userController.getJwks)
}
