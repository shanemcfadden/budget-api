import fs from "fs/promises";
import path from "path";
import { RowDataPacket, OkPacket, ResultSetHeader } from "mysql2";
import db from "../database/db";

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
    const queryPath = path.join(
      __dirname,
      "..",
      "database",
      "queries",
      "users",
      "findByEmail.sql"
    );
    let query: string;
    let results:
      | RowDataPacket[]
      | RowDataPacket[][]
      | OkPacket
      | OkPacket[]
      | ResultSetHeader;

    try {
      query = await fs.readFile(queryPath, "utf-8");
    } catch {
      throw new Error("query path invalid");
    }

    try {
      [results] = await db.query(query, [email]);
    } catch {
      throw new Error("No user associated with this email");
    }

    const userData = (results as RowDataPacket)[0];
    const user = {
      _id: userData.id,
      email: userData.email,
      password: userData.pw,
      firstName: userData.first_name,
      lastName: userData.last_name,
    };

    return user;
  }

  static async create(newUserData: NewUserData): Promise<{ _id: string }> {
    return { _id: "mockId" };
  }
}

export default User;
