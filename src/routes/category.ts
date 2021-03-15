import { RequestHandler, Router } from "express";
import CategoryController from "../controllers/category";

const router = Router();

router.post("/", CategoryController.postCategory as RequestHandler);

router.patch("/:id", CategoryController.patchCategory as RequestHandler);

router.delete("/:id", CategoryController.deleteCategory as RequestHandler);

export default router;
