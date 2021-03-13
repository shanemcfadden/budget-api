import { RequestHandler, Router } from "express";
import { body } from "express-validator";
import AuthController from "../controllers/auth";
import {
  throwAllValidationErrorMessages,
  throwFirstValidationErrorMessage,
} from "../middleware/validator";
import isValidPassword from "../util/isValidPassword";

const router = Router();

router.post(
  "/login",
  body("email", "Invalid email or password").isEmail().normalizeEmail(),
  body("password", "Invalid email or password")
    .trim()
    .custom(isValidPassword()),
  throwFirstValidationErrorMessage,
  AuthController.login as RequestHandler
);

router.put(
  "/signup",
  body("email", "Email is invalid")
    .isEmail()
    .isLength({ max: 100 })
    .normalizeEmail(),
  body("password")
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
    .trim()
    .custom(
      isValidPassword(
        "Password must be 8-20 characters long and contain at least one uppercase letter, lowercase letter, number, and special character"
      )
    ),
  body("firstName", "First name is required")
    .trim()
    .isLength({ min: 1, max: 100 }),
  body("lastName", "Last name is required")
    .trim()
    .isLength({ min: 1, max: 100 }),
  throwAllValidationErrorMessages,
  AuthController.signup as RequestHandler
);

export default router;
