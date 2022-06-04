import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should create user", async () => {
    const newUser = {
      email: "testingUser@email.com",
      name: "Testing User",
      password: "748159263",
    };

    const user = await createUserUseCase.execute(newUser);

    expect(user).toBeDefined();
    expect(user).toHaveProperty("id");
    expect(user.email).toBe(newUser.email);
  });

  it("should not be able to create user with repeated email", async () => {
    const email = "testingUser@email.com";

    await createUserUseCase.execute({
      email,
      name: "First user",
      password: "123456789",
    });

    expect(async () => {
      await createUserUseCase.execute({
        email,
        name: "Second User",
        password: "748159263",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
