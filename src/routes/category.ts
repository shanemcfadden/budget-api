import { RequestHandler, Router } from "express";
import CategoryController from "controllers/category";
import CategoryValidator from "validators/category";

const router = Router();

router.post(
  "/",
  CategoryValidator.postCategory,
  CategoryController.postCategory as RequestHandler
);

router.patch(
  "/:id",
  CategoryValidator.patchCategory,
  CategoryController.patchCategory as RequestHandler
);

router.delete(
  "/:id",
  CategoryValidator.deleteCategory,
  CategoryController.deleteCategory as RequestHandler
);

export default router;
