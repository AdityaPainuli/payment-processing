import { MoneyRequest, Passbook, User } from "./types/type";

function generateUserId(): string {
  const min = 1000000;
  const max = 9999999;

  const userId = Math.floor(Math.random() * (max - min) + min);

  return userId.toString();
}

export class UserManager implements User {
  // credentials should be stored in private values but for some reason it is not.
  userId: string;
  total_amt: number;
  public created_at: Date;
  passbook: Passbook[];
  moneyRequest: MoneyRequest[];
  constructor() {
    this.created_at = new Date();
    this.passbook = [];
    this.total_amt = 0;
    this.userId = generateUserId();
    this.moneyRequest = [];
  }

  requestMoney(amt: number, time: Date, recipient: User) {
    // push notifcatiion to that particular person's inbox.
    recipient.moneyRequest.push({
      amt: amt,
      requestedByUserId: this.userId, // we should not send the whole other user to another acc.
      time: new Date(),
    });
    // push notification history into current User account as well.
    this.moneyRequest.push({
      amt: amt,
      time: new Date(),
      requestedByUserId: recipient.userId,
    });
    // in future , add ws to send realtime updates about inbox.
  }

  checkbalance() {
    return this.total_amt;
  }

  public getUserId(): string {
    return this.userId;
  }
}
