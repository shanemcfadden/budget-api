import { Router } from "express";
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

router.get("/", getBudgets);

router.post(
  "/",
  body("title", "Budget title is required").isLength({ min: 1, max: 100 }),
  body(
    "description",
    "Budget description must contain no more than 240 characters"
  ).isLength({ max: 240 }),
  throwAllValidationErrorMessages,
  postBudget
);

router.get("/:id", getBudget);

router.patch(
  "/:id",
  body("title", "Budget title is required").isLength({ min: 1, max: 100 }),
  body(
    "description",
    "Budget description must contain no more than 240 characters"
  ).isLength({ max: 240 }),
  throwAllValidationErrorMessages,
  patchBudget
);

router.delete("/:id", deleteBudget);

export default router;
