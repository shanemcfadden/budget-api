import { body, param, ValidationChain } from "express-validator";

export const trimDescription = body("description").trim();

export const validateIdParam = (modelName: string): ValidationChain => {
  return param("id", `Invalid ${modelName} id`).isInt();
};

const validateId = (modelName: string): ValidationChain => {
  return body(
    `${modelName}Id`,
    `Specify a${modelName === "account" ? "n" : ""} ${modelName} id`
  ).isInt();
};

export const validateAccountId = validateId("account");
export const validateBudgetId = validateId("budget");
export const validateCategoryId = validateId("category");
export const validateSubcategoryId = validateId("subcategory");
