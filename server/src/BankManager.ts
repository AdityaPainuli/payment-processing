import { UserManager } from "./User";
import { Passbook, User } from "./types/type";

export class BankManager {
  private users: User[];
  private total_amt: number;
  constructor(users: User[], total_amt: number) {
    this.users = users;
    this.total_amt = total_amt;
  }
  creatingAccount(user: User) {
    this.users.push(user);
    console.log("A new user is added here -> ", user);
  }

  closingAccount(user: User) {
    const index = this.users.findIndex((u) => u.userId === user.userId);
    if (index !== -1) {
      // we can add more logic in the frontend to export passbook or close all money request from other accounts.
      this.total_amt -= this.users[index].total_amt;
      this.users.splice(index, 1);
    }
  }

  transferMoney(depositingUser: User, recievingUser: User, amt: number) {
    const incrementingUser = this.users.find(
      (u) => u.userId === depositingUser.userId
    );
    const decrementingUser = this.users.find(
      (u) => u.userId === recievingUser.userId
    );
    if (incrementingUser?.userId === decrementingUser?.userId) {
      console.error("Can't do operation on the same account");
      return;
    }

    if (
      decrementingUser?.total_amt === undefined ||
      decrementingUser?.total_amt <= amt
    ) {
      console.error("Insuffcient balance");
      return;
    }

    if (incrementingUser && decrementingUser) {
      incrementingUser.total_amt += amt;
      decrementingUser.total_amt -= amt;
      const passbookEntry: Passbook = {
        amt: amt,
        date: new Date(),
        from: depositingUser,
        to: recievingUser,
      };
      incrementingUser.passbook.push(passbookEntry);
      decrementingUser.passbook.push(passbookEntry);
    } else {
      console.error("User is not defined. check userId");
      return;
    }
  }

  getTotalAmount(): number {
    return this.total_amt;
  }

  findUser(users: User[], userId: string): User | undefined {
    const foundUser = users.find((user) => user.userId === userId);
    return foundUser;
  }
  monitorAccounts() {
    return this.users;
  }
  addMoney(amt: number, userId: string): User {
    // outsrc don't make sense but will be needed in future.
    const targetUser = this.users.find((user) => user.userId === userId);
    if (targetUser === undefined) throw new Error("User don't exists.");
    targetUser.total_amt += amt;
    this.total_amt += amt; // increasing overall bank value
    // we are not maintaining passbook logic for this..
    return targetUser;
  }
}
