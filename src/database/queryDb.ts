import { query } from "express";
import fs from "fs/promises";
import path from "path";
import { RowDataPacket, OkPacket, ResultSetHeader } from "mysql2";
import db from "./db";

const queryDb = async function (
  queryPath: string,
  values: any[]
): Promise<
  RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader
> {
  const splitPath = queryPath.split("/");
  const completePath = path.join(__dirname, "queries", ...splitPath);

  let query: string;
  let results:
    | RowDataPacket[]
    | RowDataPacket[][]
    | OkPacket
    | OkPacket[]
    | ResultSetHeader;

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

export default queryDb;
