import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should successfully authenticate user with correct credentials", async () => {
    const newUser = {
      email: "testingUser@email.com",
      password: "748159263",
      name: "Testing User",
    };

    // Create user
    await createUserUseCase.execute(newUser);

    const { user, token } = await authenticateUserUseCase.execute({
      email: newUser.email,
      password: newUser.password,
    });

    expect(user).toBeDefined();
    expect(token).toBeDefined();
  });

  it("should throw incorrect email or password error on inexisting user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "inexisting_email@email.com",
        password: "anyPassword189",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should throw incorrect email or password error on wrong password", async () => {
    const newUser = {
      email: "testingUser@email.com",
      password: "748159263",
      name: "Testing User",
    };

    await createUserUseCase.execute(newUser);

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: newUser.email,
        password: "anyPassword189",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
