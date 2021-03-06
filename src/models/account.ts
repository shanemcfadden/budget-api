import {
  create,
  findById,
  update,
  removeById,
  findAllByUserId,
  findAllByBudgetId,
  IdPacket,
} from "../util/models";

interface NewAccountData {
  name: string;
  description?: string;
  startDate: Date;
  startBalance: number;
  budgetId: number;
}
interface AccountData extends NewAccountData {
  id: number;
  currentBalance: number;
}

const modelName = "account";

class Account {
  static async create(accountData: NewAccountData): Promise<IdPacket> {
    const {
      name,
      description,
      startDate,
      startBalance,
      budgetId,
    } = accountData;
    return await create(
      [name, description, startDate, startBalance, budgetId],
      modelName
    );
  }

  static async findById(accountId: number) {
    return await findById(accountId, modelName);
  }

  static async findAllByBudgetId(budgetId: number) {
    return await findAllByBudgetId(budgetId, modelName);
  }

  static async findAllByUserId(userId: string) {
    return await findAllByUserId(userId, modelName);
  }

  static async update(accountData: AccountData) {
    const {
      id,
      name,
      description,
      startDate,
      startBalance,
      budgetId,
    } = accountData;
    return await update(
      id,
      [name, description, startDate, startBalance, budgetId],
      modelName
    );
  }

  static async removeById(accountId: number) {
    return await removeById(accountId, modelName);
  }
}

export default Account;
