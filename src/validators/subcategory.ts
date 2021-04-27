import { body } from "express-validator";
import { throwAllValidationErrorMessages } from "middleware/validator";
import {
  trimDescription,
  validateBodyElementMax,
  validateCategoryId,
  validateIdParam,
} from "./common";
import { SUBCATEGORY_SETTINGS } from "./settings";

const { description } = SUBCATEGORY_SETTINGS;

const validateDescriptionIsNotNull = body(
  "description",
  "Subcategory description is required"
).isLength({
  min: description.min,
});
const validateDescriptionLength = validateBodyElementMax(
  "subcategory",
  "description",
  description.max
);
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
