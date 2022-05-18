import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransfersError } from "./CreateTransfersError";

interface IRequest {
  id: string;
  sender_id: string;
  amount: number;
  description: string;
}

@injectable()
export class CreateTransactionUseCase {
  constructor(
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    id,
    sender_id,
    amount,
    description,
  }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user || user.id === sender_id) {
      throw new CreateTransfersError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: id,
    });

    if (user.id !== sender_id) {
      throw new Error("Incorrect transition");
    }
  }
}
