import {
  create,
  findById,
  findAllByBudgetId,
  removeById,
  update,
  IdPacket,
} from "../util/models";

interface NewMacroCategoryData {
  description: string;
  isIncome: boolean;
  budgetId: number;
}

interface MacroCategoryData extends NewMacroCategoryData {
  id: number;
}

const modelName = "macro-categorie";

class MacroCategory {
  static async create(
    newTransactionData: NewMacroCategoryData
  ): Promise<IdPacket> {
    const { description, isIncome, budgetId } = newTransactionData;
    return await create(
      [description, isIncome, budgetId],
      modelName // TODO: unify plural model names
    );
  }

  static async findById(transactionId: number): Promise<MacroCategoryData> {
    return (await findById(
      transactionId,
      modelName
    )) as Promise<MacroCategoryData>;
  }

  static async findAllByBudgetId(
    budgetId: number
  ): Promise<MacroCategoryData[]> {
    return (await findAllByBudgetId(
      budgetId,
      modelName
    )) as MacroCategoryData[];
  }

  static async update(transactionData: MacroCategoryData): Promise<boolean> {
    const { id, description, isIncome, budgetId } = transactionData;
    return await update(id, [description, isIncome, budgetId], modelName);
  }

  static async removeById(id: number): Promise<boolean> {
    return await removeById(id, modelName);
  }
}

export default MacroCategory;
