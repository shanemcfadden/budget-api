import {
  create,
  findById,
  update,
  removeById,
  findAllByUserId,
  findAllByBudgetId,
  IdPacket,
} from "../util/models";
import { NewAccountData, CompleteAccountData } from "../types/models";

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

  static async findById(accountId: number): Promise<CompleteAccountData> {
    return (await findById(accountId, modelName)) as CompleteAccountData;
  }

  static async findAllByBudgetId(
    budgetId: number
  ): Promise<CompleteAccountData[]> {
    return (await findAllByBudgetId(
      budgetId,
      modelName
    )) as CompleteAccountData[];
  }

  static async findAllByUserId(userId: string): Promise<CompleteAccountData[]> {
    return (await findAllByUserId(userId, modelName)) as CompleteAccountData[];
  }

  static async update(accountData: CompleteAccountData): Promise<boolean> {
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
