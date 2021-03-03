import { RowDataPacket } from "mysql2";
import { queryDb } from "../database/Database";
import { findById } from "../util/models";
interface AccountData {
  id: number;
  name: string;
  description?: string;
  startDate: Date;
  startingBalance: number;
  budgetId: number;
}
class Account {
  static async findById(accountId: number) {
    return await findById(accountId, "account");
  }

  static async findAllByUserId(userId: string) {
    const accounts = (await queryDb("accounts/findAllByUserId.sql", [
      userId,
    ])) as RowDataPacket[];
    return accounts;
  }
}

export default Account;
