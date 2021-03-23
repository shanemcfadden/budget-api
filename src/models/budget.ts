import { RowDataPacket } from "mysql2";
import {
  create,
  findAllByUserId,
  findById,
  IdPacket,
  removeById,
  update,
} from "util/models";
import {
  NewBudgetData,
  BudgetData,
  CompleteBudgetData,
  BudgetAccountData,
} from "types/models";
import { queryDb } from "database/Database";
import { ServerError } from "util/errors";
import Category from "models/category";
import Transaction from "models/transaction";

const modelName = "budget";

class Budget {
  static async create(newBudgetData: NewBudgetData): Promise<IdPacket> {
    const { title, description } = newBudgetData;
    return await create([title, description], modelName);
  }

  static async addUser(budgetId: number, userId: string): Promise<boolean> {
    await queryDb("budgets/addUser.sql", [budgetId, userId]);
    return true;
  }

  static async findDetailsById(budgetId: number): Promise<CompleteBudgetData> {
    const [
      budgetAccountData,
      transactionData,
      categoryData,
    ] = await Promise.all([
      Budget.findByIdWithAccountData(budgetId),
      Transaction.findAllByBudgetId(budgetId),
      Category.findAllByBudgetIdWithSubcategories(budgetId),
    ]);
    return {
      ...budgetAccountData,
      transactions: transactionData,
      categories: categoryData,
    };
  }

  static async findById(budgetId: number): Promise<BudgetData> {
    return (await findById(budgetId, modelName)) as BudgetData;
  }

  static async findByIdWithAccountData(
    budgetId: number
  ): Promise<BudgetAccountData> {
    const rawData = (await queryDb("budgets/findByIdWithAccountData.sql", [
      budgetId,
    ])) as RowDataPacket[];

    if (!rawData[0]) throw new ServerError(404, "Budget not found");
    const budgetData: BudgetAccountData = {
      id: budgetId,
      title: rawData[0].budgetTitle,
      description: rawData[0].budgetDescription,
      accounts: {},
    };
    rawData.forEach(
      ({
        accountId,
        accountName,
        accountDescription,
        startDate,
        startBalance,
        currentBalance,
      }) => {
        // Prevents budgets without accounts from being filled with NULL data
        // caused by RIGHT JOIN
        if (accountId) {
          budgetData.accounts[accountId] = {
            name: accountName,
            description: accountDescription,
            startDate,
            startBalance: +startBalance,
            currentBalance: +currentBalance,
          };
        }
      }
    );
    return budgetData;
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
