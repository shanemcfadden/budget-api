import { RowDataPacket } from "mysql2";
import {
  create,
  findAllByUserId,
  findById,
  IdPacket,
  removeById,
  update,
} from "../util/models";
import {
  NewBudgetData,
  BudgetData,
  BudgetAccountTransactionData,
} from "../types/models";
import { queryDb } from "../database/Database";
import { ServerError } from "../util/errors";

const modelName = "budget";

class Budget {
  static async create(newBudgetData: NewBudgetData): Promise<IdPacket> {
    const { title, description } = newBudgetData;
    return await create([title, description], modelName);
  }

  static async findById(budgetId: number): Promise<BudgetData> {
    return (await findById(budgetId, modelName)) as BudgetData;
  }

  // NOTE: Current balance only works when retrieving every transaction
  // Perhaps in future, calculate current balance in table and specify number of transactions
  // in function args
  static async findByIdWithAccountsAndTransactions(
    budgetId: number
  ): Promise<BudgetAccountTransactionData> {
    const rawData = (await queryDb(
      "budgets/findByIdWithAccountsAndTransactions",
      [budgetId]
    )) as RowDataPacket[];

    if (!rawData[0]) throw new ServerError(404, "Budget not found");
    const budgetData: BudgetAccountTransactionData = {
      id: budgetId,
      title: rawData[0].budgetTitle,
      description: rawData[0].budgetDescription,
      accounts: {},
      transactions: [],
    };

    rawData.forEach((dataRow) => {
      const {
        transactionId,
        transactionAmount,
        transactionDescription,
        transactionDate,
        transactionAccountId,
        transactionCategoryId,
        accountId,
        accountName,
        accountStartDate,
        accountStartBalance,
      } = dataRow;
      if (!budgetData.accounts[accountId]) {
        budgetData.accounts[accountId] = {
          name: accountName,
          startDate: accountStartDate,
          startBalance: accountStartBalance,
          currentBalance: accountStartBalance,
        };
      }
      if (transactionId) {
        budgetData.transactions.push({
          id: transactionId,
          amount: transactionAmount,
          description: transactionDescription,
          date: transactionDate,
          accountId: transactionAccountId,
          categoryId: transactionCategoryId,
        });
        budgetData.accounts[accountId].currentBalance += transactionAmount;
      }
    });
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
