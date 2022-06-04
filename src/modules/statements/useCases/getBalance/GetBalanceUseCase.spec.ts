import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should throw error when user does not exist", () => {
    expect(async () => {
      const user_id = "non-existing-user-id";
      await getBalanceUseCase.execute({ user_id });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });

  it("should get statements", async () => {
    const newUser = await inMemoryUsersRepository.create({
      email: "testingUser@email.com",
      password: "748159263",
      name: "Testing User",
    });

    const user_id = newUser.id as string;

    await inMemoryStatementsRepository.create({
      user_id,
      description: "Entrada número 1",
      amount: 125,
      type: OperationType.DEPOSIT,
    });

    await inMemoryStatementsRepository.create({
      user_id,
      description: "Entrada número 2",
      amount: 55,
      type: OperationType.WITHDRAW,
    });

    const balance = await getBalanceUseCase.execute({ user_id });

    expect(balance).toBeDefined();
    expect(balance.statement).toHaveLength(2);
  });
});
