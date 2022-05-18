import { container } from "tsyringe";
import { Request, Response } from "express";
import { CreateTransactionUseCase } from "./CreateTransactionUseCase";

export class CreateTransferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { user_id: sender_id } = request.params;
    const { amount, description } = request.body;
    const { id } = request.user;

    const createTransactionUseCase = container.resolve(
      CreateTransactionUseCase
    );

    await createTransactionUseCase.execute({
      id,
      sender_id: String(sender_id),
      amount,
      description,
    });

    return response.send();
  }
}
