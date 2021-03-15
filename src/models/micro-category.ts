import {
  create,
  findById,
  findAllByBudgetId,
  removeById,
  update,
  IdPacket,
} from "../util/models";
import { SubcategoryData, NewSubcategoryData } from "../types/models";

const modelName = "subcategory";

class Subcategory {
  static async create(
    newTransactionData: NewSubcategoryData
  ): Promise<IdPacket> {
    const { description, categoryId } = newTransactionData;
    return await create([description, categoryId], modelName);
  }

  static async findById(transactionId: number): Promise<SubcategoryData> {
    return (await findById(transactionId, modelName)) as SubcategoryData;
  }

  static async findAllByBudgetId(budgetId: number): Promise<SubcategoryData[]> {
    return (await findAllByBudgetId(budgetId, modelName)) as SubcategoryData[];
  }

  static async update(transactionData: SubcategoryData): Promise<boolean> {
    const { id, description, categoryId } = transactionData;
    return await update(id, [description, categoryId], modelName);
  }

  static async removeById(id: number): Promise<boolean> {
    return await removeById(id, modelName);
  }
}

export default Subcategory;
