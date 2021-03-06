import {
  create,
  findAllByUserId,
  findById,
  removeById,
  update,
} from "../util/models";

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
    return await findAllByUserId(userId, "budget");
  }

  static async update(budgetData: BudgetData) {
    const { id, title, description } = budgetData;
    return await update(id, [title, description], "budget");
  }

  static async removeById(id: number) {
    return await removeById(id, "budget");
  }
}

export default Budget;
