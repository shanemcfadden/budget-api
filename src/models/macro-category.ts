import {
  create,
  findById,
  findAllByBudgetId,
  removeById,
  update,
  IdPacket,
} from "../util/models";
import {
  NewMacroCategoryData,
  MacroCategoryData,
  CategoriesData,
} from "../types/models";
import { queryDb } from "../database/Database";

const modelName = "macro-category";

class MacroCategory {
  static async create(
    newTransactionData: NewMacroCategoryData
  ): Promise<IdPacket> {
    const { description, isIncome, budgetId } = newTransactionData;
    return await create([description, isIncome, budgetId], modelName);
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

  static async findAllByBudgetIdWithMicroCategories(
    budgetId: number
  ): Promise<CategoriesData> {
    const rawData = (await queryDb(
      "macro-categories/findAllByBudgetIdWithMicroCategories.sql",
      [budgetId]
    )) as {
      id: number;
      macroCategoryDescription: string;
      isIncome: number;
      budgetId: number;
      microCategoryId: number;
      microCategoryDescription: string;
    }[];

    const data = rawData.reduce(
      (
        output: Record<
          number,
          {
            description: string;
            isIncome: boolean;
            microCategories: Record<number, string>;
          }
        >,
        {
          id,
          macroCategoryDescription,
          isIncome,
          microCategoryId,
          microCategoryDescription,
        }
      ) => {
        if (!output[id]) {
          output[id] = {
            description: macroCategoryDescription,
            isIncome: !!isIncome,
            microCategories: {},
          };
        }
        if (microCategoryId != null) {
          output[id].microCategories[
            microCategoryId
          ] = microCategoryDescription;
        }
        return output;
      },
      {}
    );
    return data;
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
