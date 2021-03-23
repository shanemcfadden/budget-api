import { v4 as uuid } from "uuid";
import { RowDataPacket } from "mysql2";
import { getQueryPath, queryDb } from "database/Database";
import { findAllByBudgetId, findById, removeById, update } from "util/models";
import { UserDataMinusPassword, NewUserData, UserData } from "types/models";
import Account from "models/account";
import Category from "models/category";
import Subcategory from "models/subcategory";

const modelName = "user";

class User {
  static async findById(id: string): Promise<UserDataMinusPassword> {
    return (await findById(id, modelName)) as UserDataMinusPassword;
  }

  static async findByEmail(email: string): Promise<UserData | null> {
    const results = await queryDb(getQueryPath(modelName, "findByEmail"), [
      email,
    ]);

    if ((results as RowDataPacket).length < 1) return null;

    const user = (results as RowDataPacket)[0];
    return user;
  }

  static async findAllByBudgetId(
    budgetId: number
  ): Promise<UserDataMinusPassword[]> {
    return (await findAllByBudgetId(
      budgetId,
      modelName
    )) as UserDataMinusPassword[];
  }

  static async create(newUserData: NewUserData): Promise<{ _id: string }> {
    const { email, password, firstName, lastName } = newUserData;
    const id = uuid();
    await queryDb(getQueryPath(modelName, "create"), [
      id,
      email,
      password,
      firstName,
      lastName,
    ]);
    return { _id: id };
  }

  static async update(userData: UserData): Promise<boolean> {
    const { _id, email, firstName, lastName } = userData;
    return await update(_id, [email, firstName, lastName], modelName);
  }

  static async removeById(id: string): Promise<boolean> {
    return await removeById(id, modelName);
  }

  static async hasPermissionToEditAccount(
    userId: string,
    accountId: number
  ): Promise<boolean> {
    const accessibleAccounts = await Account.findAllByUserId(userId);
    return !!accessibleAccounts.filter(
      (accountData) => accountData.id === accountId
    ).length;
  }

  static async hasPermissionToEditBudget(
    userId: string,
    budgetId: number
  ): Promise<boolean> {
    const authorizedUsers = await User.findAllByBudgetId(budgetId);
    return !!authorizedUsers.filter((userData) => userData._id === userId)
      .length;
  }

  static async hasPermissionToEditCategory(
    userId: string,
    categoryId: number
  ): Promise<boolean> {
    return await Category.checkUserPermissions(categoryId, userId);
  }

  static async hasPermissionToEditSubcategory(
    userId: string,
    subcategoryId: number
  ): Promise<boolean> {
    return await Subcategory.checkUserPermissions(subcategoryId, userId);
  }
}

export default User;
