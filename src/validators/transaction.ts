import { body, param } from "express-validator";
import { throwAllValidationErrorMessages } from "middleware/validator";
import { trimDescription, validateIdParam } from "./common";

const validateDescription = body(
  "description",
  "Transaction description must not exceed 100 characters"
).isLength({ max: 100 });
const validateAmount = body("amount", "Transaction amount is required").isFloat(
  {
    min: -99999999.99,
    max: 9999999.99,
  }
);
const validateAccountId = body("accountId", "Specify an account id").isInt();
const validateSubcategoryId = body(
  "subcategoryId",
  "Specify a subcategory id"
).isInt();
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
