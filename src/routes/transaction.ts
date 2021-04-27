import { RequestHandler, Router } from "express";
import { body, param } from "express-validator";
import { throwAllValidationErrorMessages } from "../middleware/validator";
import TransactionController from "../controllers/transaction";

const router = Router();

router.post(
  "/",
  body(
    "description",
    "Transaction description must not exceed 100 characters"
  ).isLength({ max: 100 }),
  body("amount", "Transaction amount is required").isFloat({
    min: -99999999.99,
    max: 9999999.99,
  }),
  body("accountId", "Specify an account id").isInt(),
  body("subcategoryId", "Specify a subcategory id").isInt(),
  body("date", "Transaction date is required").isDate(),
  throwAllValidationErrorMessages,
  TransactionController.postTransaction as RequestHandler
);

router.patch(
  "/:id",
  param("id", "Invalid transaction id").isInt(),
  body(
    "description",
    "Transaction description must not exceed 100 characters"
  ).isLength({ max: 100 }),
  body("amount", "Transaction amount is required").isFloat({
    min: -99999999.99,
    max: 9999999.99,
  }),
  body("accountId", "Specify an account id").isInt(),
  body("subcategoryId", "Specify a subcategory id").isInt(),
  body("date", "Transaction date is required").isDate(),
  throwAllValidationErrorMessages,
  TransactionController.patchTransaction as RequestHandler
);

router.delete(
  "/:id",
  param("id", "Invalid transaction id").isInt(),
  throwAllValidationErrorMessages,
  TransactionController.deleteTransaction as RequestHandler
);

export default router;
