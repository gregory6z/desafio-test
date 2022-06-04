import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should show user profile when user exists", async () => {
    const newUser = await inMemoryUsersRepository.create({
      name: "Testing User",
      email: "testingUser@email.com",
      password: "748159263",
    });

    const newUserId = newUser.id as string;

    const user = await showUserProfileUseCase.execute(newUserId);

    expect(user).toBeDefined();
    expect(user).toEqual(newUser);
  });

  it("should throw error on non-existent user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("non-existing-id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
