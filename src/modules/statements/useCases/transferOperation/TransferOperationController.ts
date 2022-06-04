import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferOperationUseCase } from "./TransferOperationUseCase";

export class TransferOperationController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id: sender_id } = req.user;
    const { user_id } = req.params;
    const { amount, description } = req.body;

    const transferOperationUseCase = container.resolve(TransferOperationUseCase);

    const result = await transferOperationUseCase.execute({
      amount,
      description,
      sender_id,
      user_id,
    })


    return res.json(result);
  }
}
