import { getConnection } from "typeorm";
import { User } from "./user.entity";
import {
  Get,
  Post,
  JsonController,
  Body,
  Req,
  Res,
  UnauthorizedError,
} from "routing-controllers";
import rasha from "rasha";
import { publicKey } from "../config/jwt";
import { passport } from "../config/passport";
import { promisify } from "util";

@JsonController()
export class UserController {
  @Get("/users")
  getAll() {
    return getConnection().manager.find(User, { relations: ["roles"] });
  }

  @Post("/signup")
  public async signup(
    @Body({ validate: { groups: ["signup"] } }) { username, password }: User,
    @Req() req: unknown,
    @Res() res: unknown
  ) {
    const tmpUser = User.create({ username });
    tmpUser.password = password;
    const user = await tmpUser.save();
    await promisify(passport.authenticate("local"))(req, res);
    return user.getUser();
  }

  @Post("/login")
  public async login(@Req() req: unknown, @Res() res: unknown) {
    const user = await new Promise<User | false>((resolve, reject) => {
      passport.authenticate("local", (err, user) => {
        if (err) return reject(new UnauthorizedError(err));
        resolve(user);
      })(req, res);
    });
    if (!user) return new UnauthorizedError("invalid username or password");
    return user.getUser();
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
  }
}
