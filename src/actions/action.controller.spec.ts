import {
  ITestWorld,
  bootstrapTestServer,
  getFreeUsername,
} from "../__tests__/shared";
import { User } from "../user/user.entity";

describe("action.controller", () => {
  let world: ITestWorld;
  beforeAll(async () => (world = await bootstrapTestServer()));
  afterAll(() => world.close());

  let username: string;
  let user: User;
  const password = "test-password";

  beforeEach(async () => {
    username = await getFreeUsername();
    user = await Object.assign(User.create({ username }), {
      password,
    }).save();
  });
  afterEach(() => user.remove());

  it("throws an error for unimplemented action", async () => {
    const response = await world.client.post(
      "/actions",
      {
        action: { name: "UnimplementedAction" },
        input: {},
      },
      { validateStatus: () => true }
    );
    expect(response.status).toMatchInlineSnapshot(`422`);
    expect(response.data.code).toMatchInlineSnapshot(`"422"`);
    expect(response.data.message).toMatchInlineSnapshot(
      `"Actions code not implemented"`
    );
  });

  describe("Login", () => {
    it("throws an errror for invalid credentials", async () => {
      const response = await world.client.post(
        "/actions",
        {
          action: { name: "Login" },
          input: {
            username: "jake",
            password: "secretpassword",
          },
        },
        { validateStatus: () => true }
      );
      expect(response.status).toMatchInlineSnapshot(`422`);
      expect(response.data.code).toMatchInlineSnapshot(`"422"`);
      expect(response.data.message).toMatchInlineSnapshot(
        `"invalid credentials"`
      );
    });

    it("returns token and userr id", async () => {
      const response = await world.client.post(
        "/actions",
        {
          action: { name: "Login" },
          input: {
            username: username,
            password: password,
          },
        },
        { validateStatus: () => true }
      );
      expect(response.status).toMatchInlineSnapshot(`200`);
      expect(Object.keys(response.data)).toEqual(["accessToken", "userId"]);
      expect(response.data.accessToken?.length).toBeGreaterThan(10);
      expect(response.data.userId).toBe(user.id);
    });
  });
});
