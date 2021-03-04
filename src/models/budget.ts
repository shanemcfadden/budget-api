import { OkPacket, RowDataPacket } from "mysql2";
import { queryDb } from "../database/Database";
import { create, findById, removeById, update } from "../util/models";

interface NewBudgetData {
  title?: string;
  description?: string;
}
interface BudgetData extends NewBudgetData {
  id: number;
}

class Budget {
  static async create(newBudgetData: NewBudgetData) {
    const { title, description } = newBudgetData;
    return await create([title, description], "budget");
  }

  static async findById(budgetId: number) {
    return await findById(budgetId, "budget");
  }

  static async findAllByUserId(userId: string) {
    const budgets = (await queryDb("budgets/findAllByUserId.sql", [
      userId,
    ])) as RowDataPacket[];
    return budgets;
  }

  static async update(budgetData: BudgetData) {
    const { id, title, description } = budgetData;
    return await update(id, [title, description], "budget");
  }

  static async removeById(id: number) {
    return await removeById(id, "budget");
    // const results = (await queryDb("budgets/removeById.sql", [id])) as OkPacket;
    // if (results.affectedRows === 1) {
    //   return true;
    // } else if (!results.affectedRows) {
    //   throw new Error("Budget does not exist");
    // }
    // throw new Error(
    //   "Multiple rows deleted due to faulty query. Fix budgets/removeById.sql"
    // );
  }
}

export default Budget;
