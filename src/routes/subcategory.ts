import { RequestHandler, Router } from "express";
import SubcategoryController from "controllers/subcategory";
import SubcategoryValidator from "validators/subcategory";

const router = Router();

router.post(
  "/",
  SubcategoryValidator.postSubcategory,
  SubcategoryController.postSubcategory as RequestHandler
);

router.patch(
  "/:id",
  SubcategoryValidator.patchSubcategory,
  SubcategoryController.patchSubcategory as RequestHandler
);

router.delete(
  "/:id",
  SubcategoryValidator.deleteSubcategory,
  SubcategoryController.deleteSubcategory as RequestHandler
);

export default router;
