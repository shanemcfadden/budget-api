import { body, param } from "express-validator";
import { throwAllValidationErrorMessages } from "middleware/validator";

const validateTitle = body("title", "Budget title is required").isLength({
  min: 1,
  max: 100,
});
const validateDescription = body(
  "description",
  "Budget description must contain no more than 240 characters"
).isLength({ max: 240 });
const validateBudgetIdParam = param("id", "Invalid budget id").isInt();

const BudgetValidator = {
  postBudget: [
    validateTitle,
    validateDescription,
    throwAllValidationErrorMessages,
  ],
  getBudget: [validateBudgetIdParam, throwAllValidationErrorMessages],
  patchBudget: [
    validateBudgetIdParam,
    validateTitle,
    validateDescription,
    throwAllValidationErrorMessages,
  ],
  deleteBudget: [validateBudgetIdParam, throwAllValidationErrorMessages],
};

export default BudgetValidator;
