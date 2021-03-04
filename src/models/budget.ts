import { RowDataPacket } from "mysql2";
import { queryDb } from "../database/Database";
import { findById } from "../util/models";

interface BudgetData {
  id: number;
  title?: string;
  description?: string;
}

class Budget {
  static async create() {}

  static async findById(budgetId: number) {
    return findById(budgetId, "budget");
  }

  static async findAllByUserId(userId: string) {
    const budgets = (await queryDb("budgets/findAllByUserId.sql", [
      userId,
    ])) as RowDataPacket[];
    return budgets;
  }

  static async update() {}

  static async removeById() {}
}

export default Budget;
