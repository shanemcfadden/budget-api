import { RequestHandler, Router } from "express";
import { body } from "express-validator";
import { throwAllValidationErrorMessages } from "../middleware/validator";
import AccountController from "../controllers/account";

const router = Router();

router.post(
  "/",
  body("name", "Account name is required").isLength({ min: 1, max: 100 }),
  body(
    "description",
    "Account description must not exceed 240 characters"
  ).isLength({ max: 240 }),
  body("startBalance", "Account starting balance is required").isFloat({
    min: -99999999.99,
    max: 99999999.99,
  }),
  body("startDate", "Account starting date is required").isDate(),
  body("budgetId", "A Budget id is required").isInt(),
  throwAllValidationErrorMessages,
  AccountController.postAccount as RequestHandler
);

router.patch(
  "/:id",
  body("name", "Account name is required").isLength({ min: 1, max: 100 }),
  body(
    "description",
    "Account description must not exceed 240 characters"
  ).isLength({ max: 240 }),
  body("startBalance", "Account starting balance is required").isFloat({
    min: -99999999.99,
    max: 99999999.99,
  }),
  body("startDate", "Account starting date is required").isDate(),
  throwAllValidationErrorMessages,
  AccountController.patchAccount as RequestHandler
);

router.delete("/:id", AccountController.deleteAccount as RequestHandler);

export default router;
