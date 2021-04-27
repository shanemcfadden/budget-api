import { body } from "express-validator";
import {
  throwAllValidationErrorMessages,
  throwFirstValidationErrorMessage,
} from "middleware/validator";
import isValidPassword from "util/isValidPassword";
import { AUTH_SETTINGS } from "./settings";

const { email, firstName, lastName } = AUTH_SETTINGS;

const validateEmail = body("email", "Invalid email or password")
  .isEmail()
  .normalizeEmail();
const validateSanitizeEmail = body("email", "Email is invalid")
  .isEmail()
  .isLength({ max: email.max }) // TODO: Reconsider: isLength
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
  .isLength({ min: firstName.min, max: firstName.max });
const validateSanitizeLastName = body("lastName", "Last name is required")
  .trim()
  .isLength({ min: lastName.min, max: lastName.max });

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
