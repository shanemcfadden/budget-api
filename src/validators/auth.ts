import { body } from "express-validator";
import {
  throwAllValidationErrorMessages,
  throwFirstValidationErrorMessage,
} from "middleware/validator";
import isValidPassword from "util/isValidPassword";

const validateEmail = body("email", "Invalid email or password")
  .isEmail()
  .normalizeEmail();
const validateSanitizeEmail = body("email", "Email is invalid")
  .isEmail()
  .isLength({ max: 100 })
  .normalizeEmail();
const validatePassword = body("password", "Invalid email or password")
  .trim()
  .custom(isValidPassword());
const validateSanitizePassword = body("password")
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
  );
const validateSanitizeFirstName = body("firstName", "First name is required")
  .trim()
  .isLength({ min: 1, max: 100 });

const validateSanitizeLastName = body("lastName", "Last name is required")
  .trim()
  .isLength({ min: 1, max: 100 });

const AuthValidator = {
  login: [validateEmail, validatePassword, throwFirstValidationErrorMessage],
  signup: [
    validateSanitizeEmail,
    validateSanitizePassword,
    validateSanitizeFirstName,
    validateSanitizeLastName,
    throwAllValidationErrorMessages,
  ],
};

export default AuthValidator;
