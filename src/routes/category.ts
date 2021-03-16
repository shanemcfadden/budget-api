import { RequestHandler, Router } from "express";
import { body } from "express-validator";
import { throwAllValidationErrorMessages } from "../middleware/validator";
import CategoryController from "../controllers/category";

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
  CategoryController.postCategory as RequestHandler
);

router.patch(
  "/:id", // TODO: Sanitize/validate id param
  body("description", "Category description is required").isLength({ min: 1 }),
  body(
    "description",
    "Category description must not exceed 100 characters"
  ).isLength({ max: 100 }),
  body(
    "isIncome",
    "Specify whether or not this category is for income"
  ).isBoolean(),
  CategoryController.patchCategory as RequestHandler
);

router.delete("/:id", CategoryController.deleteCategory as RequestHandler);

export default router;
