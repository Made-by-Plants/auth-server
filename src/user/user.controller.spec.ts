import { ITestWorld, bootstrapTestServer } from "../__tests__/shared";

describe("user.controller", () => {
  let world: ITestWorld;
  beforeAll(async () => (world = await bootstrapTestServer()));
  afterAll(() => world.close());

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
