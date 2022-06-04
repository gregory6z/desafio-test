import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

const newUser = {
  email: "testingUser@email.com",
  name: "Testing User",
  password: "748159263",
};

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send(newUser);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should return error on missing authorization header", async () => {
    const response = await request(app).get("/api/v1/profile");

    expect(response.status).toBe(401);
  });

  it("should return error on invalid JWT", async () => {
    const response = await request(app).get("/api/v1/profile").set({
      Authorization: "Bearer randomJWT",
    });

    expect(response.status).toBe(401);
  });

  it("should get user profile on authorized user", async () => {
    const authResponse = await request(app).post("/api/v1/sessions").send({
      email: newUser.email,
      password: newUser.password,
    });

    const { token } = authResponse.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(newUser.email);
  });
});
