import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import { RowDataPacket, OkPacket, ResultSetHeader } from "mysql2";
import db from "../database/db";
import queryDb from "../database/queryDb";
import { query } from "express";

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
