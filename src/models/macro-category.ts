import {
  create,
  findById,
  findAllByBudgetId,
  removeById,
  update,
} from "../util/models";

interface NewMacroCategoryData {
  description: string;
  isIncome: boolean;
  budgetId: number;
}

interface MacroCategoryData extends NewMacroCategoryData {
  id: number;
}

class MacroCategory {
  static async create(newTransactionData: NewMacroCategoryData) {
    const { description, isIncome, budgetId } = newTransactionData;
    return await create(
      [description, isIncome, budgetId],
      "macro-categorie" // TODO: unify plural model names
    );
  }

  static async findById(transactionId: number) {
    return await findById(transactionId, "macro-categorie");
  }

  static async findAllByBudgetId(budgetId: number) {
    return await findAllByBudgetId(budgetId, "macro-categorie");
  }

  static async update(transactionData: MacroCategoryData) {
    const { id, description, isIncome, budgetId } = transactionData;
    return await update(
      id,
      [description, isIncome, budgetId],
      "macro-categorie"
    );
  }

  static async removeById(id: number) {
    return await removeById(id, "macro-categorie");
  }
}

export default MacroCategory;
