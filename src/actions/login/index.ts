import { User } from "../../user/user.entity";

export type ActionLoginArgs = {
  username: string;
  password: string;
};

export class ActionLogin {
  constructor(private args: ActionLoginArgs) {}

  public async handle(): Promise<{ accessToken: string; userId: string }> {
    const user = await User.authPassword(
      this.args.username,
      this.args.password
    );
    return { accessToken: await user.getJwt(), userId: user.id };
  }
}
