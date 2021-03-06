import {
  create,
  findById,
  findAllByBudgetId,
  removeById,
  update,
  IdPacket,
} from "../util/models";

interface NewTransactionData {
  amount: number;
  description?: string;
  date: Date;
  accountId: number;
  categoryId: number;
}

interface TransactionData extends NewTransactionData {
  id: number;
}

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
      categoryId,
    } = newTransactionData;
    return await create(
      [amount, description, date, accountId, categoryId],
      modelName
    );
  }

  static async findById(transactionId: number): Promise<TransactionData> {
    return (await findById(transactionId, modelName)) as TransactionData;
  }

  static async findAllByBudgetId(budgetId: number): Promise<TransactionData[]> {
    return (await findAllByBudgetId(budgetId, modelName)) as TransactionData[];
  }

  static async update(transactionData: TransactionData): Promise<boolean> {
    const {
      id,
      amount,
      description,
      date,
      accountId,
      categoryId,
    } = transactionData;
    return await update(
      id,
      [amount, description, date, accountId, categoryId],
      modelName
    );
  }

  static async removeById(id: number): Promise<boolean> {
    return await removeById(id, modelName);
  }
}

export default Transaction;
