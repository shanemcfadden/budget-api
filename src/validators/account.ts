import { body } from "express-validator";
import { throwAllValidationErrorMessages } from "middleware/validator";
import {
  trimDescription,
  validateDescriptionMax,
  validateBudgetId,
  validateIdParam,
} from "./common";
import { ACCOUNT_SETTINGS } from "./settings";

const { name, description, startBalance } = ACCOUNT_SETTINGS;

const trimName = body("name").trim();

const validateName = body("name", "Account name is required").isLength({
  min: 1,
  max: name.max,
});

const validateDescription = validateDescriptionMax("account", description.max);

const validateStartBalance = body(
  "startBalance",
  "Account starting balance is required"
).isFloat({
  min: startBalance.min,
  max: startBalance.max,
});

const validateStartDate = body(
  "startDate",
  "Account starting date is required"
).isDate();

const validateAccountIdParam = validateIdParam("account");

const accountValidatorBase = [
  trimName,
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
