import { body } from "express-validator";
import { throwAllValidationErrorMessages } from "middleware/validator";
import {
  trimDescription,
  validateAccountId,
  validateIdParam,
  validateSubcategoryId,
} from "./common";
import { TRANSACTION_SETTINGS } from "./settings";

const { description, amount } = TRANSACTION_SETTINGS;

const validateDescription = body(
  "description",
  "Transaction description must not exceed 100 characters"
).isLength({ max: description.max });
const validateAmount = body("amount", "Transaction amount is required").isFloat(
  {
    min: amount.min,
    max: amount.max,
  }
);
const validateDate = body("date", "Transaction date is required").isDate();
const validateTransactionIdParam = validateIdParam("transaction");

const transactionValidatorBase = [
  trimDescription,
  validateDescription,
  validateAmount,
  validateAccountId,
  validateSubcategoryId,
  validateDate,
];

const TransactionValidator = {
  postTransaction: [
    ...transactionValidatorBase,
    throwAllValidationErrorMessages,
  ],
  patchTransaction: [
    validateTransactionIdParam,
    ...transactionValidatorBase,
    throwAllValidationErrorMessages,
  ],
  deleteTransaction: [
    validateTransactionIdParam,
    throwAllValidationErrorMessages,
  ],
};

export default TransactionValidator;
