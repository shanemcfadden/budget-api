import { OkPacket, RowDataPacket } from "mysql2";
import { queryDb } from "../database/Database";
import { capitalize } from "./strings";

type RowId = number | string;
export interface IdPacket {
  _id: number;
}

export async function findById(id: RowId, model: string) {
  const results = (await queryDb(`${pluralModel(model)}/findById.sql`, [
    id,
  ])) as RowDataPacket[];
  if (results.length < 1) {
    return null;
  }
  return results[0];
}

export async function findAllByBudgetId(id: number, model: string) {
  return (await queryDb(`${pluralModel(model)}/findAllByBudgetId.sql`, [
    id,
  ])) as RowDataPacket[];
}

export async function findAllByUserId(id: string, model: string) {
  return (await queryDb(`${pluralModel(model)}/findAllByUserId.sql`, [
    id,
  ])) as RowDataPacket[];
}

export async function create(data: any[], model: string): Promise<IdPacket> {
  const results = (await queryDb(
    `${pluralModel(model)}/create.sql`,
    data
  )) as OkPacket;

  return {
    _id: results.insertId,
  };
}

export async function update(id: RowId, data: any[], model: string) {
  const results = (await queryDb(`${pluralModel(model)}/update.sql`, [
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
    `Multiple rows updated due to faulty query. Fix ${pluralModel(
      model
    )}/update.sql`
  );
}

export async function removeById(id: RowId, model: string) {
  const results = (await queryDb(`${pluralModel(model)}/removeById.sql`, [
    id,
  ])) as OkPacket;
  if (results.affectedRows === 1) {
    return true;
  } else if (!results.affectedRows) {
    throw new Error(`${capitalize(model)} does not exist`);
  }
  throw new Error(
    `Multiple rows deleted due to faulty query. Fix ${pluralModel(
      model
    )}/removeById.sql`
  );
}

function pluralModel(modelName: string): string {
  const oddPlurals: Record<string, string> = {
    "macro-category": "macro-categories",
    "micro-category": "micro-categories",
  };
  return oddPlurals[modelName] || modelName + "s";
}
