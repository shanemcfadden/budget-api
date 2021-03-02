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
  static async findById(budgetId: number) {}

  static async findAllByUserId(userId: string) {}

  static async findAllByBudgetId(budgetId: number) {}
}

export default Account;
