import { Router } from "express";
import { body } from "express-validator";
import { login, signup } from "../controllers/auth";

const router = Router();

router.post(
  "/login",
  body("email", "Invalid email or password").isEmail().normalizeEmail(),
  body("password", "Invalid email or password")
    .trim()
    .custom((value) => {
      const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
      if (value.match(validPassword)) {
        return true;
      }
      throw new Error();
    }),
  login
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
    .custom((value) => {
      const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
      if (value.match(validPassword)) {
        return true;
      }
      throw new Error(
        "Password must be 8-20 characters long with at least one of the following: uppercase letter, lowercase letter, number, special character"
      );
    }),
  body("firstName", "First name is required")
    .trim()
    .isLength({ min: 1, max: 100 }),
  body("lastName", "Last name is required")
    .trim()
    .isLength({ min: 1, max: 100 }),
  signup
);

export default router;
