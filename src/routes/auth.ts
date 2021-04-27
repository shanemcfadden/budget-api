import { RequestHandler, Router } from "express";
import AuthController from "controllers/auth";
import AuthValidator from "validation/auth";

const router = Router();

router.post(
  "/login",
  AuthValidator.login,
  AuthController.login as RequestHandler
);

router.put(
  "/signup",
  AuthValidator.signup,
  AuthController.signup as RequestHandler
);

export default router;
