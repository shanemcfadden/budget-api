import { v4 as uuid } from "uuid";
import { RowDataPacket } from "mysql2";
import { queryDb } from "../database/Database";

interface NewUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
interface UserData extends NewUserData {
  _id: string;
}

class User {
  static async findByEmail(email: string): Promise<UserData | null> {
    const results = await queryDb("/users/findByEmail.sql", [email]);

    if ((results as RowDataPacket).length < 1) {
      return null;
    }

    const user = (results as RowDataPacket)[0];
    return user;
  }

  static async create(newUserData: NewUserData): Promise<{ _id: string }> {
    const { email, password, firstName, lastName } = newUserData;
    const id = uuid();

    await queryDb("users/create.sql", [
      id,
      email,
      password,
      firstName,
      lastName,
    ]);

    return { _id: id };
  }
}

export default User;
