import { RowDataPacket, OkPacket } from "mysql2";
import { queryDb } from "../database/Database";
import { create, findById } from "../util/models";
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
    const results = (await queryDb("accounts/update.sql", [
      name,
      description,
      startDate,
      startBalance,
      budgetId,
      id,
    ])) as OkPacket;
    if (results.affectedRows === 1) {
      return true;
    } else if (!results.affectedRows) {
      throw new Error("Account does not exist");
    }
    throw new Error(
      "Multiple rows updated due to faulty query. Fix accounts/update.sql"
    );
  }

  static async removeById(accountId: number) {
    const results = (await queryDb("accounts/removeById.sql", [
      accountId,
    ])) as OkPacket;
    if (results.affectedRows === 1) {
      return true;
    } else if (!results.affectedRows) {
      throw new Error("Account does not exist");
    }
    throw new Error(
      "Multiple rows deleted due to faulty query. Fix accounts/removeById.sql"
    );
  }
}

export default Account;
