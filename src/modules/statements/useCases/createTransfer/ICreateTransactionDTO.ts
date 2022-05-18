export interface ICreateTransactionDTO {
  user_id: string;
  sender_id: string;
  amount: number;
  description: string;
  type: "deposit" | "withdraw";
  transaction: "transferred " | "received";
}
