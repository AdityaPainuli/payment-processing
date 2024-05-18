import { Bank } from "./Bank";
import express, { Request, Response } from "express";
import { Actions, User } from "./types/type";
import { UserManager } from "./User";

const app = express();
const port = 3000;

const bank = new Bank();

app.use(express.json());

app.use("/create-user", async (req, res) => {
  const newUser = new UserManager();
  bank.BankHandler({ action: Actions.CREATE_ACCOUNT, user: newUser });
  console.log("New account created -> ", newUser);
  res.status(200).json({
    newUser,
  });
});

app.use("/transfer-money", async (req: Request, res: Response) => {
  const { ruserId, dUserId } = await req.body;
  const ruser = bank.BankHandler({
    action: Actions.FIND_USER,
    userId: ruserId,
  });
  const duser = bank.BankHandler({
    action: Actions.FIND_USER,
    userId: dUserId,
  });
  if (ruser === undefined && duser === undefined) {
    console.error("User is not defined.");
    return;
  }
  bank.BankHandler({
    action: Actions.TRANSFER_MONEY,
    amt: 200,
    depositingUser: duser,
    receivingUser: ruser,
  });
});

app.use("/close-account", async (req, res) => {
  const { userId } = await req.body;
  const userAccount = bank.BankHandler({
    action: Actions.FIND_USER,
    userId: userId,
  });
  bank.BankHandler({ action: Actions.CLOSE_ACCOUNT, user: userAccount });
});

app.use("/request-money", async (req, res) => {
  const { requestingUserId, recipientUserId, amt } = await req.body;
  try {
    const requestingUser: UserManager = bank.BankHandler({
      action: Actions.FIND_USER,
      userId: requestingUserId,
    });
    const recipientUser = bank.BankHandler({
      action: Actions.FIND_USER,
      userId: recipientUserId,
    });
    requestingUser.requestMoney(amt, new Date(), recipientUser);
    console.log("Entry made -> ", requestingUser.moneyRequest);
    res.status(200).json({ recipientUser, requestingUser });
  } catch (error) {
    console.log("Error ", error);
    res.status(500).json({ error: error });
  }
});

app.use("/check-balance", async (req, res) => {
  const { userId } = await req.body;
  const user: UserManager = bank.BankHandler({
    action: Actions.FIND_USER,
    userId: userId,
  });
  let total_bal = user.checkbalance();
  console.log("Total balance is -> ", total_bal);
});

app.use("/monitor-bank", async (req, res) => {
  try {
    const { password } = req.body;
    const { accounts, totalAmt }: { accounts: User[]; totalAmt: number } =
      bank.BankHandler({
        action: Actions.MONITOR_BANK,
        password,
      });

    const responseData = accounts.map((user: User) => ({
      userId: user.userId,
      totalAmount: user.total_amt,
      passbookDetails: user.passbook,
      moneyRequests: user.moneyRequest,
      accountCreatedAt: user.created_at.getDate(),
    }));

    res.status(200).json({
      accounts: responseData,
      totalAmount: totalAmt,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use("/add-money", async (req, res) => {
  const { password, amt, userId } = await req.body;
  try {
    const updatedUser = bank.BankHandler({
      action: Actions.ADD_MONEY,
      password: password,
      amt: amt,
      userId: userId,
    });
    res.status(200).json({
      updatedUser,
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Check console logs" });
  }
});

app.listen(port, () => {
  console.log("Server is running in port 3000");
});

// creating-user - done
// addingMoney - done
// transferingMoney - need to see ( passbook and bank logic both)
// requestMoney - need to see requestingArray.
// closingAccount - logic ( send money to some else account ).
