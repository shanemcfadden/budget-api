import { RowDataPacket } from "mysql2";
import {
  create,
  findById,
  update,
  removeById,
  findAllByUserId,
  findAllByBudgetId,
  IdPacket,
} from "util/models";
import {
  NewAccountData,
  CompleteAccountData,
  UpdateAccountData,
} from "types/models";
import { queryDb } from "database/Database";

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

  static async getCurrentBalance(accountId: number): Promise<number> {
    const {
      currentBalance,
    } = ((await queryDb("accounts/getCurrentDatabase.sql", [
      accountId,
    ])) as RowDataPacket[])[0];
    return currentBalance;
  }

  static async update(accountData: UpdateAccountData): Promise<boolean> {
    const { id, name, description, startDate, startBalance } = accountData;
    return await update(
      id,
      [name, description, startDate, startBalance],
      modelName
    );
  }

  static async removeById(accountId: number): Promise<boolean> {
    return await removeById(accountId, modelName);
  }
}

export default Account;
