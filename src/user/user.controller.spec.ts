import {
  ITestWorld,
  bootstrapTestServer,
  getFreeUsername,
} from "../__tests__/shared";
import { User } from "./user.entity";

describe("user.controller", () => {
  let world: ITestWorld;
  beforeAll(async () => (world = await bootstrapTestServer()));
  afterAll(() => world.close());

  describe("/signup", () => {
    it("creates user and hashes password", async () => {
      const password = "dumb-test-password";
      const username = await getFreeUsername();
      const response = await world.client.post("/signup", {
        username,
        password,
      });

      expect(response.data.id.length).toBe(36);
      expect(response.data.name).toEqual(username);
      expect(response.data.roles).toEqual(["user"]);
      expect(response.data.token.length).toBeGreaterThan(100);

      const user = await User.findOneOrFail({ username });

      expect(user.password !== password).toBeTruthy();
      expect(user.passwordHash !== password).toBeTruthy();
      expect(user.verifyPassword(password)).toBeTruthy();

      await user.remove();
    });

    it("validates username and password presence", async () => {
      const response = await world.client.post(
        "/signup",
        {},
        { validateStatus: () => true }
      );
      expect(response.data.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "children": Array [],
            "constraints": Object {
              "minLength": "username must be longer than or equal to 5 characters",
            },
            "property": "username",
            "target": Object {},
          },
          Object {
            "children": Array [],
            "constraints": Object {
              "minLength": "password must be longer than or equal to 6 characters",
            },
            "property": "password",
            "target": Object {},
          },
        ]
      `);
    });
  });

  describe("/jwks", () => {
    it("returns jwt keys", async () => {
      const response = await world.client.get("/jwks");
      expect(Object.keys(response.data.keys[0])).toMatchInlineSnapshot(`
        Array [
          "kty",
          "n",
          "e",
          "alg",
          "use",
          "kid",
        ]
      `);
    });
  });
});
