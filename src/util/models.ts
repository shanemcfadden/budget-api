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

export async function update(id: number | string, data: any[], model: string) {
  const results = (await queryDb(`${model}s/update.sql`, [
    ...data,
    id,
  ])) as OkPacket;
  if (results.affectedRows === 1) {
    return true;
  }
  if (!results.affectedRows) {
    const capitalizedModel = model[0].toUpperCase() + model.slice(1);
    throw new Error(`${capitalizedModel} does not exist`);
  }
  throw new Error(
    `Multiple rows updated due to faulty query. Fix ${model}s/update.sql`
  );
}
