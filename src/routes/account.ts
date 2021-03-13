import { RequestHandler, Router } from "express";
import AccountController from "../controllers/account";

const router = Router();

router.post("/", AccountController.postAccount as RequestHandler);

router.patch("/:id", AccountController.patchAccount as RequestHandler);

router.delete("/:id", AccountController.deleteAccount as RequestHandler);

export default router;
