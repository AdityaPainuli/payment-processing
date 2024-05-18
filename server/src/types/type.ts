import { UserManager } from "../User";

export interface Passbook {
  from: User;
  to: User;
  amt: number;
  date: Date;
}

export interface User {
  userId: string;
  total_amt: number;
  passbook: Passbook[];
  created_at: Date;
  moneyRequest: MoneyRequest[];
}

export enum Actions {
  CREATE_ACCOUNT = "create_account",
  CLOSE_ACCOUNT = "close_account",
  TRANSFER_MONEY = "transfer_money",
  GET_TOTAL_AMT = "get_total_amt",
  REQUEST_MONEY = "request_money",
  FIND_USER = "find_user",
  MONITOR_BANK = "monitor_bank",
  ADD_MONEY = "add_money",
}

export interface MoneyRequest {
  requestedByUserId: string;
  time: Date;
  amt: number;
}

export interface BankHandlerOptions {
  action: Actions;
  user?: UserManager;
  amt?: number;
  receivingUser?: User;
  depositingUser?: User;
  userId?: string;
  password?: string;
}
