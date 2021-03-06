import { v4 as uuid } from "uuid";
import { RowDataPacket } from "mysql2";
import { getQueryPath, queryDb } from "../database/Database";
import { findById, removeById, update } from "../util/models";

interface NewUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
interface UserData extends NewUserData {
  _id: string;
}

const modelName = "user";

class User {
  static async findById(id: string): Promise<UserData> {
    return (await findById(id, modelName)) as UserData;
  }

  static async findByEmail(email: string): Promise<UserData | null> {
    const results = await queryDb(getQueryPath(modelName, "findByEmail"), [
      email,
    ]);

    if ((results as RowDataPacket).length < 1) return null;

    const user = (results as RowDataPacket)[0];
    return user;
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
    const { _id, email, password, firstName, lastName } = userData;
    return await update(_id, [email, password, firstName, lastName], modelName);
  }

  static async removeById(id: string): Promise<boolean> {
    return await removeById(id, modelName);
  }
}

export default User;
