import { RequestHandler, Router } from "express";
import SubcategoryController from "../controllers/subcategory";

const router = Router();

router.post("/", SubcategoryController.postSubcategory as RequestHandler);

router.patch(
  "/:subcategoryId",
  SubcategoryController.patchSubcategory as RequestHandler
);

router.delete(
  "/:subcategoryId",
  SubcategoryController.deleteSubcategory as RequestHandler
);

export default router;
