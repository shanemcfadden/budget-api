import { RowDataPacket, OkPacket } from "mysql2";
import { queryDb } from "../database/Database";
import { create, findById, update, removeById } from "../util/models";
interface NewAccountData {
  name: string;
  description?: string;
  startDate: Date;
  startBalance: number;
  budgetId: number;
}
interface AccountData extends NewAccountData {
  id: number;
}
class Account {
  static async create(accountData: NewAccountData) {
    const {
      name,
      description,
      startDate,
      startBalance,
      budgetId,
    } = accountData;
    return await create(
      [name, description, startDate, startBalance, budgetId],
      "account"
    );
  }

  static async findById(accountId: number) {
    return await findById(accountId, "account");
  }

  static async findAllByUserId(userId: string) {
    const accounts = (await queryDb("accounts/findAllByUserId.sql", [
      userId,
    ])) as RowDataPacket[];
    return accounts;
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
      "account"
    );
  }

  static async removeById(accountId: number) {
    return await removeById(accountId, "account");
  }
}

export default Account;
