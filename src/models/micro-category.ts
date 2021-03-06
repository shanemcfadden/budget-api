import {
  create,
  findById,
  findAllByBudgetId,
  removeById,
  update,
} from "../util/models";

interface NewMicroCategoryData {
  description: string;
  macroCategoryId: number;
}

interface MicroCategoryData extends NewMicroCategoryData {
  id: number;
}

class MicroCategory {
  static async create(newTransactionData: NewMicroCategoryData) {
    const { description, macroCategoryId } = newTransactionData;
    return await create(
      [description, macroCategoryId],
      "micro-categorie" // TODO: unify plural model names
    );
  }

  static async findById(transactionId: number) {
    return await findById(transactionId, "micro-categorie");
  }

  static async findAllByBudgetId(budgetId: number) {
    return await findAllByBudgetId(budgetId, "micro-categorie");
  }

  static async update(transactionData: MicroCategoryData) {
    const { id, description, macroCategoryId } = transactionData;
    return await update(id, [description, macroCategoryId], "micro-categorie");
  }

  static async removeById(id: number) {
    return await removeById(id, "micro-categorie");
  }
}

export default MicroCategory;
