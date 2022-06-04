import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;
describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("should successfully create user", async () => {
    const newUserBody = {
      email: "testingUser@email.com",
      name: "Testing User",
      password: "748159263",
    };

    const response = await request(app).post("/api/v1/users").send(newUserBody);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({});
  });

  it("should return error when creating user with repeated email", async () => {
    const newUserBody = {
      email: "testingUser@email.com",
      name: "Second User",
      password: "1548748159263",
    };

    const response = await request(app).post("/api/v1/users").send(newUserBody);

    expect(response.statusCode).toBe(400);
  });
});
