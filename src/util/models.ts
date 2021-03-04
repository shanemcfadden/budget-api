import { OkPacket, RowDataPacket } from "mysql2";
import { queryDb } from "../database/Database";

export async function findById(id: number | string, model: string) {
  const results = (await queryDb(`${model}s/findById.sql`, [
    id,
  ])) as RowDataPacket[];
  if (results.length < 1) {
    return null;
  }
  return results[0];
}

export async function create(data: any[], model: string) {
  const results = (await queryDb(`${model}s/create.sql`, data)) as OkPacket;

  return {
    _id: results.insertId,
  };
}
