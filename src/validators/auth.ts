import { body } from "express-validator";
import {
  throwAllValidationErrorMessages,
  throwFirstValidationErrorMessage,
} from "middleware/validator";
import isValidPassword from "util/isValidPassword";
import { AUTH_SETTINGS } from "./settings";

const { email, firstName, lastName } = AUTH_SETTINGS;

const validateEmail = body("email", "Invalid email or password")
  .normalizeEmail()
  .isEmail();
const validatePassword = body("password", "Invalid email or password")
  .trim()
  .custom(isValidPassword());
const validateNewEmail = body("email", "Email is invalid")
  .normalizeEmail()
  .isEmail()
  .isLength({ max: email.max });
const validateNewPassword = body("password")
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
const validateFirstName = body("firstName", "First name is required").isLength({
  min: firstName.min,
  max: firstName.max,
});
const validateLastName = body("lastName", "Last name is required").isLength({
  min: lastName.min,
  max: lastName.max,
});

const AuthValidator = {
  login: [validateEmail, validatePassword, throwFirstValidationErrorMessage],
  signup: [
    validateNewEmail,
    validateNewPassword,
    body("firstName").trim(),
    validateFirstName,
    body("lastName").trim(),
    validateLastName,
    throwAllValidationErrorMessages,
  ],
};

export default AuthValidator;
