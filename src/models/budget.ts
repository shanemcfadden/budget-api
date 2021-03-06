import {
  create,
  findAllByUserId,
  findById,
  IdPacket,
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

const modelName = "budget";

class Budget {
  static async create(newBudgetData: NewBudgetData): Promise<IdPacket> {
    const { title, description } = newBudgetData;
    return await create([title, description], modelName);
  }

  static async findById(budgetId: number): Promise<BudgetData> {
    return (await findById(budgetId, modelName)) as BudgetData;
  }

  static async findAllByUserId(userId: string): Promise<BudgetData[]> {
    return (await findAllByUserId(userId, modelName)) as BudgetData[];
  }

  static async update(budgetData: BudgetData): Promise<boolean> {
    const { id, title, description } = budgetData;
    return await update(id, [title, description], modelName);
  }

  static async removeById(id: number): Promise<boolean> {
    return await removeById(id, modelName);
  }
}

export default Budget;
