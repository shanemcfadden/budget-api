import {
  create,
  findById,
  findAllByBudgetId,
  removeById,
  update,
  IdPacket,
} from "util/models";
import { NewTransactionData, TransactionData } from "types/models";
import { queryDb } from "database/Database";

const modelName = "transaction";

class Transaction {
  static async create(
    newTransactionData: NewTransactionData
  ): Promise<IdPacket> {
    const {
      amount,
      description,
      date,
      accountId,
      subcategoryId,
    } = newTransactionData;
    return await create(
      [amount, description, date, accountId, subcategoryId],
      modelName
    );
  }

  static async findById(transactionId: number): Promise<TransactionData> {
    return (await findById(transactionId, modelName)) as TransactionData;
  }

  static async findAllByBudgetId(budgetId: number): Promise<TransactionData[]> {
    return (await findAllByBudgetId(budgetId, modelName)) as TransactionData[];
  }

  static async findAllByCategoryId(
    categoryId: number
  ): Promise<TransactionData[]> {
    return (await queryDb("transactions/findAllByCategoryId.sql", [
      categoryId,
    ])) as TransactionData[];
  }

  static async findAllBySubcategoryId(
    subcategoryId: number
  ): Promise<TransactionData[]> {
    return (await queryDb("transactions/findAllBySubcategoryId.sql", [
      subcategoryId,
    ])) as TransactionData[];
  }

  static async update(transactionData: TransactionData): Promise<boolean> {
    const {
      id,
      amount,
      description,
      date,
      accountId,
      subcategoryId,
    } = transactionData;
    return await update(
      id,
      [amount, description, date, accountId, subcategoryId],
      modelName
    );
  }

  static async removeById(id: number): Promise<boolean> {
    return await removeById(id, modelName);
  }
}

export default Transaction;
