import { RequestHandler, Router } from "express";
import TransactionController from "../controllers/transaction";
import TransactionValidator from "validators/transaction";

const router = Router();

router.post(
  "/",
  TransactionValidator.postTransaction,
  TransactionController.postTransaction as RequestHandler
);

router.patch(
  "/:id",
  TransactionValidator.patchTransaction,
  TransactionController.patchTransaction as RequestHandler
);

router.delete(
  "/:id",
  TransactionValidator.deleteTransaction,
  TransactionController.deleteTransaction as RequestHandler
);

export default router;
