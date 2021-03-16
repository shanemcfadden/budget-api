import { RequestHandler, Router } from "express";
import { body } from "express-validator";
import { throwAllValidationErrorMessages } from "../middleware/validator";
import SubcategoryController from "../controllers/subcategory";

const router = Router();

router.post(
  "/",
  body("description", "Subcategory description is required").isLength({
    min: 1,
  }),
  body(
    "description",
    "Subcategory description must not exceed 100 characters"
  ).isLength({ max: 100 }),
  body("categoryId", "Specify a category id").isInt(),
  throwAllValidationErrorMessages,
  SubcategoryController.postSubcategory as RequestHandler
);

router.patch(
  "/:id",
  body("description", "Subcategory description is required").isLength({
    min: 1,
  }),
  body(
    "description",
    "Subcategory description must not exceed 100 characters"
  ).isLength({ max: 100 }),
  body("categoryId", "Specify a category id").isInt(),
  throwAllValidationErrorMessages,
  SubcategoryController.patchSubcategory as RequestHandler
);

router.delete(
  "/:id",
  SubcategoryController.deleteSubcategory as RequestHandler
);

export default router;
