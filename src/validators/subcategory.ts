import { body, param } from "express-validator";
import { throwAllValidationErrorMessages } from "middleware/validator";
import { trimDescription } from "./common";

const validateDescriptionIsNotNull = body(
  "description",
  "Subcategory description is required"
).isLength({
  min: 1,
});
const validateDescriptionLength = body(
  "description",
  "Subcategory description must not exceed 100 characters"
).isLength({ max: 100 });
const validateCategoryId = body("categoryId", "Specify a category id").isInt();
const validateSubcategoryIdParam = param(
  "id",
  "Invalid subcategory id"
).isInt();

const subcategoryValidatorBase = [
  trimDescription,
  validateDescriptionIsNotNull,
  validateDescriptionLength,
  validateCategoryId,
];

const SubcategoryValidator = {
  postSubcategory: [
    ...subcategoryValidatorBase,
    throwAllValidationErrorMessages,
  ],
  patchSubcategory: [
    validateSubcategoryIdParam,
    ...subcategoryValidatorBase,
    throwAllValidationErrorMessages,
  ],
  deleteSubcategory: [
    validateSubcategoryIdParam,
    throwAllValidationErrorMessages,
  ],
};

export default SubcategoryValidator;
