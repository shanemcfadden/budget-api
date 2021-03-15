import { Controller } from "../types/controllers";
import { AuthenticatedRequestHandler } from "../types/express";
import { handleControllerErrors } from "../util/errors";

export const CategoryControllerBase: Controller = {
  postCategory: (async (req, res, next) => {
    res.send("POST category");
  }) as AuthenticatedRequestHandler,
  patchCategory: (async (req, res, next) => {
    res.send("PATCH category");
  }) as AuthenticatedRequestHandler,
  deleteCategory: (async (req, res, next) => {
    res.send("DELETE category");
  }) as AuthenticatedRequestHandler,
};

export default handleControllerErrors(CategoryControllerBase);
