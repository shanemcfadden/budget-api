import { body } from "express-validator";
import { throwAllValidationErrorMessages } from "middleware/validator";
import { trimDescription, validateCategoryId, validateIdParam } from "./common";
import { SUBCATEGORY_SETTINGS } from "./settings";

const { description } = SUBCATEGORY_SETTINGS;

const validateDescriptionIsNotNull = body(
  "description",
  "Subcategory description is required"
).isLength({
  min: description.min,
});
const validateDescriptionLength = body(
  "description",
  "Subcategory description must not exceed 100 characters"
).isLength({ max: description.max });
const validateSubcategoryIdParam = validateIdParam("subcategory");

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
