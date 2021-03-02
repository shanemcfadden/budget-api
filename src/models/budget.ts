import { RowDataPacket } from "mysql2";
import { queryDb } from "../database/Database";
interface BudgetData {
  id: number;
  title?: string;
  description?: string;
}

class Budget {
  static async findById(budgetId: number) {
    const budgets = (await queryDb("budgets/findById.sql", [
      budgetId,
    ])) as RowDataPacket[];
    if (budgets.length < 1) {
      return null;
    }
    return budgets[0];
  }

  static async findAllByUserId(userId: string) {
    const budgets = (await queryDb("budgets/findAllByUserId.sql", [
      userId,
    ])) as RowDataPacket[];
    return budgets;
  }
}

export default Budget;
