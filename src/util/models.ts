import { OkPacket, RowDataPacket } from "mysql2";
import { getQueryPath, queryDb } from "database/Database";
import { capitalize } from "util/strings";

type RowId = number | string;
export interface IdPacket {
  _id: number;
}

export async function findById(id: RowId, model: string) {
  const results = (await queryDb(getQueryPath(model, "findById"), [
    id,
  ])) as RowDataPacket[];
  return results.length ? results[0] : null;
}

export async function findAllByBudgetId(id: number, model: string) {
  return (await queryDb(getQueryPath(model, "findAllByBudgetId"), [
    id,
  ])) as RowDataPacket[];
}

export async function findAllByUserId(id: string, model: string) {
  return (await queryDb(getQueryPath(model, "findAllByUserId"), [
    id,
  ])) as RowDataPacket[];
}

export async function create(data: any[], model: string): Promise<IdPacket> {
  const results = (await queryDb(
    getQueryPath(model, "create"),
    data
  )) as OkPacket;
  return {
    _id: results.insertId,
  };
}

export async function update(id: RowId, data: any[], model: string) {
  const queryPath = getQueryPath(model, "update");
  const results = (await queryDb(queryPath, [...data, id])) as OkPacket;
  if (results.affectedRows === 1) return true;

  const errorMessage = results.affectedRows
    ? `Multiple rows updated due to faulty query. Fix ${queryPath}`
    : `${capitalize(model)} does not exist`;
  throw new Error(errorMessage);
}

export async function removeById(id: RowId, model: string) {
  const queryPath = getQueryPath(model, "removeById");
  const results = (await queryDb(queryPath, [id])) as OkPacket;
  if (results.affectedRows === 1) return true;

  const errorMessage = results.affectedRows
    ? `Multiple rows deleted due to faulty query. Fix ${queryPath}`
    : `${capitalize(model)} does not exist`;
  throw new Error(errorMessage);
}

export function pluralModel(modelName: string): string {
  const oddPlurals: Record<string, string> = {
    category: "categories",
    subcategory: "subcategories",
  };
  return oddPlurals[modelName] || modelName + "s";
}
