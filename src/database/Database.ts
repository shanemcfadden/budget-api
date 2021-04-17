import fs from "fs/promises";
import path from "path";
import { RowDataPacket, OkPacket, ResultSetHeader } from "mysql2";
import mysql from "mysql2";
import { pluralModel } from "util/models";
import { ServerError } from "util/errors";

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
  dateStrings: ["DATE"],
  timezone: "UTC",
  typeCast: (field, next) => {
    if (field.type == "DECIMAL" || field.type == "NEWDECIMAL") {
      const value = field.string();
      return value == null ? null : +value;
    }
    return next();
  },
});

export const db = pool.promise();

export const queryDb = async function (
  queryPath: string,
  values: any[] = []
): Promise<PoolQueryResults> {
  const splitPath = queryPath.split("/");
  const completePath = path.join(__dirname, "queries", ...splitPath);

  let query: string;
  let results: PoolQueryResults;
  try {
    query = await fs.readFile(completePath, "utf-8");
    [results] = await db.query(query, values);
  } catch {
    throw new ServerError(500, "Internal server error");
  }
  return results;
};

export function getQueryPath(modelName: string, queryName: string) {
  return `${pluralModel(modelName)}/${queryName}.sql`;
}
