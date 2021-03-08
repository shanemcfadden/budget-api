import { Router } from "express";
import {
  deleteBudget,
  getBudget,
  getBudgets,
  patchBudget,
  postBudget,
} from "../controllers/budget";

const router = Router();

// Get shallow budget details of current user's budgets
router.get("/", getBudgets);

// Create a new budget
router.post("/", postBudget);

// Get deep data on single budget
router.get("/:id", getBudget);

// Edit shallow budget details
router.patch("/:id", patchBudget);

// Delete budget
router.delete("/:id", deleteBudget);

export default router;
