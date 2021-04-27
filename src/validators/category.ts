import { body } from "express-validator";
import { throwAllValidationErrorMessages } from "middleware/validator";
import {
  trimDescription,
  validateDescriptionMax,
  validateBudgetId,
  validateIdParam,
} from "./common";
import { CATEGORY_SETTINGS } from "./settings";

const { description } = CATEGORY_SETTINGS;

const validateDescriptionIsNotNull = body(
  "description",
  "Category description is required"
).isLength({ min: description.min });
const validateDescriptionLength = validateDescriptionMax(
  "category",
  description.max
);
const validateIsIncome = body(
  "isIncome",
  "Specify whether or not this category is for income"
).isBoolean();
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
