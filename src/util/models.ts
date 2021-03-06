import { OkPacket, RowDataPacket } from "mysql2";
import { queryDb } from "../database/Database";
import { capitalize } from "./strings";

type RowId = number | string;

export async function findById(id: RowId, model: string) {
  const results = (await queryDb(`${model}s/findById.sql`, [
    id,
  ])) as RowDataPacket[];
  if (results.length < 1) {
    return null;
  }
  return results[0];
}

export async function findAllByBudgetId(id: number, model: string) {
  return (await queryDb(`${model}s/findAllByBudgetId.sql`, [
    id,
  ])) as RowDataPacket[];
}

export async function findAllByUserId(id: string, model: string) {
  return (await queryDb(`${model}s/findAllByUserId.sql`, [
    id,
  ])) as RowDataPacket[];
}

export async function create(data: any[], model: string) {
  const results = (await queryDb(`${model}s/create.sql`, data)) as OkPacket;

  return {
    _id: results.insertId,
  };
}

export async function update(id: RowId, data: any[], model: string) {
  const results = (await queryDb(`${model}s/update.sql`, [
    ...data,
    id,
  ])) as OkPacket;
  if (results.affectedRows === 1) {
    return true;
  }
  if (!results.affectedRows) {
    throw new Error(`${capitalize(model)} does not exist`);
  }
  throw new Error(
    `Multiple rows updated due to faulty query. Fix ${model}s/update.sql`
  );
}

export async function removeById(id: RowId, model: string) {
  const results = (await queryDb(`${model}s/removeById.sql`, [id])) as OkPacket;
  if (results.affectedRows === 1) {
    return true;
  } else if (!results.affectedRows) {
    throw new Error(`${capitalize(model)} does not exist`);
  }
  throw new Error(
    `Multiple rows deleted due to faulty query. Fix ${model}s/removeById.sql`
  );
}
