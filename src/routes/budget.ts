import { RequestHandler, Router } from "express";
import { body } from "express-validator";
import { throwAllValidationErrorMessages } from "middleware/validator";
import BudgetController from "controllers/budget";

const router = Router();

router.get("/", BudgetController.getBudgets as RequestHandler);

router.post(
  "/",
  body("title", "Budget title is required").isLength({ min: 1, max: 100 }),
  body(
    "description",
    "Budget description must contain no more than 240 characters"
  ).isLength({ max: 240 }),
  throwAllValidationErrorMessages,
  BudgetController.postBudget as RequestHandler
);

router.get("/:id", BudgetController.getBudget as RequestHandler);

router.patch(
  "/:id",
  body("title", "Budget title is required").isLength({ min: 1, max: 100 }),
  body(
    "description",
    "Budget description must contain no more than 240 characters"
  ).isLength({ max: 240 }),
  throwAllValidationErrorMessages,
  BudgetController.patchBudget as RequestHandler
);

router.delete("/:id", BudgetController.deleteBudget as RequestHandler);

export default router;
