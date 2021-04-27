import { body, param } from "express-validator";
import { throwAllValidationErrorMessages } from "middleware/validator";

const validName = body("name", "Account name is required").isLength({
  min: 1,
  max: 100,
});

const validDescription = body(
  "description",
  "Account description must not exceed 240 characters"
).isLength({ max: 240 });

const validStartBalance = body(
  "startBalance",
  "Account starting balance is required"
).isFloat({
  min: -99999999.99,
  max: 99999999.99,
});

const validStartDate = body(
  "startDate",
  "Account starting date is required"
).isDate();

const validBudgetId = body("budgetId", "Budget id is required").isInt();

const validAccountIdParam = param("id", "Invalid account id").isInt();

const accountValidatorBase = [
  validName,
  validDescription,
  validStartBalance,
  validStartDate,
];

const AccountValidator = {
  postAccount: [
    ...accountValidatorBase,
    validBudgetId,
    throwAllValidationErrorMessages,
  ],
  patchAccount: [
    validAccountIdParam,
    ...accountValidatorBase,
    throwAllValidationErrorMessages,
  ],
  deleteAccount: [validAccountIdParam, throwAllValidationErrorMessages],
};

export default AccountValidator;
