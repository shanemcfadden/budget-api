import { RequestHandler, Router } from "express";
import { body } from "express-validator";
import { throwAllValidationErrorMessages } from "../middleware/validator";
import TransactionController from "../controllers/transaction";

const router = Router();

router.post(
  "/",
  //   body("description", "Transaction description is required").isLength({
  //     min: 1,
  //   }),
  //   body(
  //     "description",
  //     "Transaction description must not exceed 100 characters"
  //   ).isLength({ max: 100 }),
  //   body("categoryId", "Specify a category id").isInt(),
  //   throwAllValidationErrorMessages,
  TransactionController.postTransaction as RequestHandler
);

router.patch(
  "/:id",
  //   body("description", "Transaction description is required").isLength({
  //     min: 1,
  //   }),
  //   body(
  //     "description",
  //     "Transaction description must not exceed 100 characters"
  //   ).isLength({ max: 100 }),
  //   body("categoryId", "Specify a category id").isInt(),
  //   throwAllValidationErrorMessages,
  TransactionController.patchTransaction as RequestHandler
);

router.delete(
  "/:id",
  TransactionController.deleteTransaction as RequestHandler
);

export default router;
