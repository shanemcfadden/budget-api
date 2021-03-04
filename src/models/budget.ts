import { RowDataPacket } from "mysql2";
import { queryDb } from "../database/Database";
import { findById } from "../util/models";

interface NewBudgetData {
  title?: string;
  description?: string;
}
interface BudgetData extends NewBudgetData {
  id: number;
}

class Budget {
  static async create(newBudgetData: NewBudgetData) {}

  static async findById(budgetId: number) {
    return findById(budgetId, "budget");
  }

  static async findAllByUserId(userId: string) {
    const budgets = (await queryDb("budgets/findAllByUserId.sql", [
      userId,
    ])) as RowDataPacket[];
    return budgets;
  }

  static async update(budgetData: BudgetData) {}

  static async removeById(id: number) {}
}

export default Budget;
