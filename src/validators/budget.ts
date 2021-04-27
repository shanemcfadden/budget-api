import { body } from "express-validator";
import { throwAllValidationErrorMessages } from "middleware/validator";
import {
  trimDescription,
  validateBodyElementMax,
  validateIdParam,
} from "./common";
import { BUDGET_SETTINGS } from "./settings";

const { title, description } = BUDGET_SETTINGS;

const trimTitle = body("title").trim();
const validateTitle = body("title", "Budget title is required").isLength({
  min: title.min,
  max: title.max,
});
const validateDescription = validateBodyElementMax(
  "budget",
  "description",
  description.max
);
const validateBudgetIdParam = validateIdParam("budget");

const budgetValidatorBase = [
  trimTitle,
  validateTitle,
  trimDescription,
  validateDescription,
];

const BudgetValidator = {
  postBudget: [...budgetValidatorBase, throwAllValidationErrorMessages],
  getBudget: [validateBudgetIdParam, throwAllValidationErrorMessages],
  patchBudget: [
    validateBudgetIdParam,
    ...budgetValidatorBase,
    throwAllValidationErrorMessages,
  ],
  deleteBudget: [validateBudgetIdParam, throwAllValidationErrorMessages],
};

export default BudgetValidator;
