import { RequestHandler, Router } from "express";
import AccountController from "controllers/account";
import AccountValidator from "validation/account";

const router = Router();

router.post(
  "/",
  AccountValidator.postAccount,
  AccountController.postAccount as RequestHandler
);

router.patch(
  "/:id",
  AccountValidator.patchAccount,
  AccountController.patchAccount as RequestHandler
);

router.delete(
  "/:id",
  AccountValidator.deleteAccount,
  AccountController.deleteAccount as RequestHandler
);

export default router;
