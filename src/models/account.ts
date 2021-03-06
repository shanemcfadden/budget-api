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

  static async findById(accountId: number): Promise<AccountData> {
    return (await findById(accountId, modelName)) as AccountData;
  }

  static async findAllByBudgetId(budgetId: number): Promise<AccountData[]> {
    return (await findAllByBudgetId(budgetId, modelName)) as AccountData[];
  }

  static async findAllByUserId(userId: string): Promise<AccountData[]> {
    return (await findAllByUserId(userId, modelName)) as AccountData[];
  }

  static async update(accountData: AccountData): Promise<boolean> {
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

  static async removeById(accountId: number): Promise<boolean> {
    return await removeById(accountId, modelName);
  }
}

export default Account;
