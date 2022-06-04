import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { TransferOperationError } from "./TransferOperationError";

interface IRequest {
  user_id: string;
  sender_id: string;
  amount: number;
  description: string;
}

@injectable()
export class TransferOperationUseCase {
  constructor(
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    amount,
    description,
    sender_id,
    user_id,
  }: IRequest): Promise<Statement> {
    const type: OperationType = OperationType.TRANSFER;

    const sender = await this.usersRepository.findById(sender_id);
    const receiver = await this.usersRepository.findById(user_id);

    if (!sender || !receiver) {
      throw new TransferOperationError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
    });

    if (balance < amount){
      throw new TransferOperationError.InsufficientFunds();
    }

    const newStatement = await this.statementsRepository.create({
      amount,
      description,
      sender_id,
      user_id,
      type,
    })

    return newStatement;
  }
}
