import { RequestHandler, Router } from "express";
import BudgetController from "controllers/budget";
import BudgetValidator from "validators/budget";

const router = Router();

router.get("/", BudgetController.getBudgets as RequestHandler);

router.post(
  "/",
  BudgetValidator.postBudget,
  BudgetController.postBudget as RequestHandler
);

router.get(
  "/:id",
  BudgetValidator.getBudget,
  BudgetController.getBudget as RequestHandler
);

router.patch(
  "/:id",
  BudgetValidator.patchBudget,
  BudgetController.patchBudget as RequestHandler
);

router.delete(
  "/:id",
  BudgetValidator.deleteBudget,
  BudgetController.deleteBudget as RequestHandler
);

export default router;
