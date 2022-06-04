import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should throw user not found error when user does not exist", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "non-existent-user-id",
        statement_id: "testing-statement",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should throw statement not found error when statement does not exist", async () => {
    const newUser = await inMemoryUsersRepository.create({
      email: "testingUser@email.com",
      password: "748159263",
      name: "Testing User",
    });

    const user_id = newUser.id as string;

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id,
        statement_id: "non-existent-statement-id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("should get statement operation", async () => {
    const newUser = await inMemoryUsersRepository.create({
      email: "testingUser@email.com",
      password: "748159263",
      name: "Testing User",
    });

    const user_id = newUser.id as string;

    const newStatement = await inMemoryStatementsRepository.create({
      user_id,
      description: "Entrada número 1",
      amount: 125,
      type: OperationType.DEPOSIT,
    });

    const statement_id = newStatement.id as string;

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id,
      statement_id: statement_id,
    });

    expect(statementOperation).toEqual(newStatement);
  });
});
