import { BankManager } from "./BankManager";
import { UserManager } from "./User";
import { Actions, BankHandlerOptions, Passbook, User } from "./types/type";

export class Bank {
  private users: UserManager[];
  private total_amt: number;
  private BankManager: BankManager;

  constructor() {
    this.users = [];
    this.total_amt = 0;
    this.BankManager = new BankManager(this.users, this.total_amt);
  }

  BankHandler(options: BankHandlerOptions): any {
    const {
      action,
      user,
      userId,
      amt,
      depositingUser,
      receivingUser,
      password,
    } = options;
    switch (action) {
      case Actions.CLOSE_ACCOUNT:
        if (user === undefined) return;
        this.BankManager.closingAccount(user);
        break;
      case Actions.CREATE_ACCOUNT:
        if (user === undefined) return;
        this.BankManager.creatingAccount(user);
        break;
      case Actions.GET_TOTAL_AMT:
        this.BankManager.getTotalAmount();
        break;
      case Actions.TRANSFER_MONEY:
        if (
          amt !== undefined &&
          depositingUser !== undefined &&
          receivingUser !== undefined
        ) {
          this.BankManager.transferMoney(depositingUser, receivingUser, amt);
        } else {
          console.error("Values are not provided.");
        }
        break;
      case Actions.FIND_USER:
        if (userId === undefined) return;
        const foundUser = this.BankManager.findUser(this.users, userId);
        return foundUser;
      case Actions.MONITOR_BANK:
        if (password !== "aditya") return;
        const accounts: User[] = this.BankManager.monitorAccounts();
        const totalAmt: number = this.BankManager.getTotalAmount();
        return { accounts, totalAmt };
      case Actions.ADD_MONEY:
        if (password !== "aditya" || amt === undefined || userId === undefined)
          throw new Error("Unauthorized or empty required fields.");
        const updatedUser = this.BankManager.addMoney(amt, userId);
        return updatedUser;
      default:
        console.error("Invalid Action. ");
    }
  }
}
