import {
  create,
  findById,
  findAllByBudgetId,
  removeById,
  update,
  IdPacket,
} from "../util/models";
import { NewCategoryData, CategoryData, CategoriesData } from "../types/models";
import Transaction from "./transaction";
import { queryDb } from "../database/Database";
import { RowDataPacket } from "mysql2";

const modelName = "category";

class Category {
  static async checkUserPermissions(
    categoryId: number,
    userId: string
  ): Promise<boolean> {
    const matchingPermissions = (await queryDb(
      "categories/checkUserPermissions.sql",
      [categoryId, userId]
    )) as RowDataPacket[];
    return !!matchingPermissions.length;
  }

  static async create(newTransactionData: NewCategoryData): Promise<IdPacket> {
    const { description, isIncome, budgetId } = newTransactionData;
    return await create([description, isIncome, budgetId], modelName);
  }

  static async findById(transactionId: number): Promise<CategoryData> {
    return (await findById(transactionId, modelName)) as Promise<CategoryData>;
  }

  static async findAllByBudgetId(budgetId: number): Promise<CategoryData[]> {
    return (await findAllByBudgetId(budgetId, modelName)) as CategoryData[];
  }

  static async findAllByBudgetIdWithSubcategories(
    budgetId: number
  ): Promise<CategoriesData> {
    const rawData = (await queryDb(
      "categories/findAllByBudgetIdWithSubcategories.sql",
      [budgetId]
    )) as {
      id: number;
      categoryDescription: string;
      isIncome: number;
      budgetId: number;
      subcategoryId: number;
      subcategoryDescription: string;
    }[];

    const data = rawData.reduce(
      (
        output: Record<
          number,
          {
            description: string;
            isIncome: boolean;
            subcategories: Record<number, string>;
          }
        >,
        {
          id,
          categoryDescription,
          isIncome,
          subcategoryId,
          subcategoryDescription,
        }
      ) => {
        if (!output[id]) {
          output[id] = {
            description: categoryDescription,
            isIncome: !!isIncome,
            subcategories: {},
          };
        }
        if (subcategoryId != null) {
          output[id].subcategories[subcategoryId] = subcategoryDescription;
        }
        return output;
      },
      {}
    );
    return data;
  }

  static async hasTransactions(id: number): Promise<boolean> {
    const transactions = await Transaction.findAllByCategoryId(id);
    return !!transactions.length;
  }

  static async update(transactionData: CategoryData): Promise<boolean> {
    const { id, description, isIncome, budgetId } = transactionData;
    return await update(id, [description, isIncome, budgetId], modelName);
  }

  static async removeById(id: number): Promise<boolean> {
    return await removeById(id, modelName);
  }
}

export default Category;
