import { Router } from "express";
import { body } from "express-validator";
import { login, signup } from "../controllers/auth";

const router = Router();

router.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").trim().isLength({ min: 8, max: 20 }),
  login
);

router.put(
  "/signup",
  body("email").isEmail().isLength({ max: 100 }).normalizeEmail(),
  body("password")
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error("Confirm using matching passwords");
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
  body("firstName").trim().isLength({ min: 1, max: 100 }),
  body("lastName").trim().isLength({ min: 1, max: 100 }),
  signup
);

export default router;
