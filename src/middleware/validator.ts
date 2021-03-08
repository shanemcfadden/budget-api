import { validationResult } from "express-validator";
import { Middleware, ValidationError } from "express-validator/src/base";
import { ServerError } from "../util/errors";

export const throwAllValidationErrorMessages: Middleware = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const errorMessage = errors
    .array()
    .reduce((completeMessage: string, { msg }: ValidationError, i): string => {
      return i === 0 ? msg : completeMessage + "; " + msg;
    }, "");
  throw new ServerError(400, errorMessage);
};

export const throwFirstValidationErrorMessage: Middleware = (
  req,
  res,
  next
) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  throw new ServerError(400, errors.array()[0].msg);
};
