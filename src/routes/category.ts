import { RequestHandler, Router } from "express";
import { body, param } from "express-validator";
import { throwAllValidationErrorMessages } from "middleware/validator";
import CategoryController from "controllers/category";

const router = Router();

router.post(
  "/",
  body("description", "Category description is required").isLength({ min: 1 }),
  body(
    "description",
    "Category description must not exceed 100 characters"
  ).isLength({ max: 100 }),
  body(
    "isIncome",
    "Specify whether or not this category is for income"
  ).isBoolean(),
  body("budgetId", "Specify a budget id").isInt(),
  throwAllValidationErrorMessages,
  CategoryController.postCategory as RequestHandler
);

router.patch(
  "/:id",
  param("id", "Invalid category id").isInt(),
  body("description", "Category description is required").isLength({ min: 1 }),
  body(
    "description",
    "Category description must not exceed 100 characters"
  ).isLength({ max: 100 }),
  body(
    "isIncome",
    "Specify whether or not this category is for income"
  ).isBoolean(),
  throwAllValidationErrorMessages,
  CategoryController.patchCategory as RequestHandler
);

router.delete(
  "/:id",
  param("id", "Invalid category id").isInt(),
  throwAllValidationErrorMessages,
  CategoryController.deleteCategory as RequestHandler
);

export default router;
