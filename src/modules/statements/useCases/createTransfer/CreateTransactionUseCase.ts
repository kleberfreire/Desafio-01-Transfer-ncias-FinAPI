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

interface IPayload {
  sub: string;
}

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
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
    const senderUser = await this.usersRepository.findById(sender_id);

    if (!user || user.id === sender_id || !senderUser) {
      throw new CreateTransfersError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: id,
    });

    if (balance < amount) {
      throw new CreateTransfersError.InsufficientFunds();
    }

    const userWithdraw = await this.statementsRepository.create({
      user_id: id,
      amount,
      description,
      type: "transfer" as OperationType,
      sender_id,
    });

    const userSender = await this.statementsRepository.create({
      user_id: sender_id,
      amount,
      description: `Transfer to ${user.name}`,
      type: "deposit" as OperationType,
    });
  }
}
