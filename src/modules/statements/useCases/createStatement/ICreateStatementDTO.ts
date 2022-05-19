import { Statement } from "../../entities/Statement";

// export type ICreateStatementDTO = Pick<
//   Statement,
//   "user_id" | "description" | "sender_id" | "amount" | "type"
// >;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

export interface ICreateStatementDTO {
  user_id: string;
  description: string;
  sender_id?: string;
  amount: number;
  type: OperationType;
}
