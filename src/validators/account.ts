import { body, param } from "express-validator";
import { throwAllValidationErrorMessages } from "middleware/validator";
import { trimDescription } from "./common";

const validateName = body("name", "Account name is required").isLength({
  min: 1,
  max: 100,
});

const validateDescription = body(
  "description",
  "Account description must not exceed 240 characters"
).isLength({ max: 240 });

const validateStartBalance = body(
  "startBalance",
  "Account starting balance is required"
).isFloat({
  min: -99999999.99,
  max: 99999999.99,
});

const validateStartDate = body(
  "startDate",
  "Account starting date is required"
).isDate();

const validateBudgetId = body("budgetId", "Budget id is required").isInt();

const validateAccountIdParam = param("id", "Invalidate account id").isInt();

const accountValidatorBase = [
  validateName,
  trimDescription,
  validateDescription,
  validateStartBalance,
  validateStartDate,
];

const AccountValidator = {
  postAccount: [
    ...accountValidatorBase,
    validateBudgetId,
    throwAllValidationErrorMessages,
  ],
  patchAccount: [
    validateAccountIdParam,
    ...accountValidatorBase,
    throwAllValidationErrorMessages,
  ],
  deleteAccount: [validateAccountIdParam, throwAllValidationErrorMessages],
};

export default AccountValidator;
