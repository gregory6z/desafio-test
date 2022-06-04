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

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send(newUser);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should authenticate created user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: newUser.email,
      password: newUser.password,
    });

    const { token, user } = response.body;

    expect(response.status).toBe(200);
    expect(token).toBeDefined();
    expect(user.email).toBe(newUser.email);
  });

  it("should return error on non existent user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "nonExistentUser@email.com",
      password: "74848488484",
    });

    expect(response.status).toBe(401);
  });

  it("should return error on wrong password", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: newUser.email,
      password: "randomPassword123",
    });

    expect(response.status).toBe(401);
  });
});
