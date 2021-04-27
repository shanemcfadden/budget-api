import { body, param } from "express-validator";
import { throwAllValidationErrorMessages } from "middleware/validator";
import { trimDescription, validateIdParam } from "./common";

const validateDescriptionIsNotNull = body(
  "description",
  "Category description is required"
).isLength({ min: 1 });
const validateDescriptionLength = body(
  "description",
  "Category description must not exceed 100 characters"
).isLength({ max: 100 });

const validateIsIncome = body(
  "isIncome",
  "Specify whether or not this category is for income"
).isBoolean();
const validateBudgetId = body("budgetId", "Specify a budget id").isInt();
const validateCategoryIdParam = validateIdParam("category");

const categoryValidatorBase = [
  trimDescription,
  validateDescriptionIsNotNull,
  validateDescriptionLength,
  validateIsIncome,
];

const CategoryValidator = {
  postCategory: [
    ...categoryValidatorBase,
    validateBudgetId,
    throwAllValidationErrorMessages,
  ],
  patchCategory: [
    validateCategoryIdParam,
    ...categoryValidatorBase,
    throwAllValidationErrorMessages,
  ],
  deleteCategory: [validateCategoryIdParam, throwAllValidationErrorMessages],
};

export default CategoryValidator;
