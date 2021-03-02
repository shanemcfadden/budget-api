import { RowDataPacket } from "mysql2";
import { queryDb } from "../database/Database";
interface AccountData {
  id: number;
  name: string;
  description?: string;
  startDate: Date;
  startingBalance: number;
  budgetId: number;
}

class Account {
  static async findById(budgetId: number) {
    const accounts = (await queryDb("accounts/findById.sql", [
      budgetId,
    ])) as RowDataPacket[];
    if (accounts.length < 1) {
      return null;
    }
    return accounts[0];
  }

  static async findAllByUserId(userId: string) {
    const accounts = (await queryDb("accounts/findAllByUserId.sql", [
      userId,
    ])) as RowDataPacket[];
    return accounts;
  }
}

export default Account;
