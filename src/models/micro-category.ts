import {
  create,
  findById,
  findAllByBudgetId,
  removeById,
  update,
  IdPacket,
} from "../util/models";

interface NewMicroCategoryData {
  description: string;
  macroCategoryId: number;
}

interface MicroCategoryData extends NewMicroCategoryData {
  id: number;
}

const modelName = "micro-categorie";

class MicroCategory {
  static async create(
    newTransactionData: NewMicroCategoryData
  ): Promise<IdPacket> {
    const { description, macroCategoryId } = newTransactionData;
    return await create(
      [description, macroCategoryId],
      modelName // TODO: unify plural model names
    );
  }

  static async findById(transactionId: number): Promise<MicroCategoryData> {
    return (await findById(transactionId, modelName)) as MicroCategoryData;
  }

  static async findAllByBudgetId(
    budgetId: number
  ): Promise<MicroCategoryData[]> {
    return (await findAllByBudgetId(
      budgetId,
      modelName
    )) as MicroCategoryData[];
  }

  static async update(transactionData: MicroCategoryData): Promise<boolean> {
    const { id, description, macroCategoryId } = transactionData;
    return await update(id, [description, macroCategoryId], modelName);
  }

  static async removeById(id: number): Promise<boolean> {
    return await removeById(id, modelName);
  }
}

export default MicroCategory;
