import {
  create,
  findById,
  findAllByBudgetId,
  removeById,
  update,
} from "../util/models";

interface NewTransactionData {
  amount: number;
  description?: string;
  date: Date;
  accountId: number;
}

interface TransactionData extends NewTransactionData {
  id: number;
}

class Transaction {
  static async create(newTransactionData: NewTransactionData) {
    const { amount, description, date, accountId } = newTransactionData;
    return await create([amount, description, date, accountId], "transaction");
  }

  static async findById(transactionId: number) {
    return await findById(transactionId, "transaction");
  }

  static async findAllByBudgetId(budgetId: number) {
    return await findAllByBudgetId(budgetId, "transaction");
  }

  static async update(transactionData: TransactionData) {
    const { id, amount, description, date, accountId } = transactionData;
    return await update(
      id,
      [amount, description, date, accountId],
      "transaction"
    );
  }

  static async removeById(id: number) {
    return await removeById(id, "transaction");
  }
}

export default Transaction;
