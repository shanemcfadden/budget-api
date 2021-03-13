import { RequestHandler, Router } from "express";
import { body } from "express-validator";
import { throwAllValidationErrorMessages } from "../middleware/validator";
import {
  deleteBudget,
  getBudget,
  getBudgets,
  patchBudget,
  postBudget,
} from "../controllers/budget";

const router = Router();

router.get("/", getBudgets as RequestHandler);

router.post(
  "/",
  body("title", "Budget title is required").isLength({ min: 1, max: 100 }),
  body(
    "description",
    "Budget description must contain no more than 240 characters"
  ).isLength({ max: 240 }),
  throwAllValidationErrorMessages,
  postBudget as RequestHandler
);

router.get("/:id", getBudget as RequestHandler);

router.patch(
  "/:id",
  body("title", "Budget title is required").isLength({ min: 1, max: 100 }),
  body(
    "description",
    "Budget description must contain no more than 240 characters"
  ).isLength({ max: 240 }),
  throwAllValidationErrorMessages,
  patchBudget as RequestHandler
);

router.delete("/:id", deleteBudget as RequestHandler);

export default router;
