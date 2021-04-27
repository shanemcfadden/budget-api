import { body, param, ValidationChain } from "express-validator";

export const trimDescription = body("description").trim();

export const validateIdParam = (modelName: string): ValidationChain => {
  return param("id", `Invalid ${modelName} id`).isInt();
};
