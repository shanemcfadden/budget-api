import fs from "fs/promises";
import path from "path";
import { RowDataPacket, OkPacket, ResultSetHeader } from "mysql2";
import mysql from "mysql2";

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

type PoolQueryResults =
  | RowDataPacket[]
  | RowDataPacket[][]
  | OkPacket
  | OkPacket[]
  | ResultSetHeader;

const pool = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
});

export const db = pool.promise();

export const queryDb = async function (
  queryPath: string,
  values: any[]
): Promise<PoolQueryResults> {
  const splitPath = queryPath.split("/");
  const completePath = path.join(__dirname, "queries", ...splitPath);

  let query: string;
  let results: PoolQueryResults;

  try {
    query = await fs.readFile(completePath, "utf-8");
  } catch {
    throw new Error("query path invalid");
  }

  try {
    [results] = await db.query(query, values);
  } catch (err) {
    console.log(err);
    throw new Error("Could not complete query");
  }
  return results;
};
