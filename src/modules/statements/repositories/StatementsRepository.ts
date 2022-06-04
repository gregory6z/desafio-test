import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    type,
    sender_id,
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type,
      sender_id,
    });

    return  this.repository.save(statement);
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[] }
    >
  {
    const statements = await this.repository.find({
      where: [
        {
          user_id
        },
        {
          sender_id: user_id
        }
      ]
    });

    const balance = statements.reduce((acc, operation) => {
      const parsedAmount = Number(operation.amount)
      if(operation?.sender_id === user_id) {
        return acc - parsedAmount
      } else {
        if (operation.type === 'deposit' || operation.type === 'transfer') {
          return acc + parsedAmount;
        } else {
          return acc - parsedAmount;
        }
      }

    }, 0)

    if (with_statement) {
      return {
        statement: statements,
        balance
      }
    }

    return { balance }
  }
}
