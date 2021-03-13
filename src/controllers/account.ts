import { Controller } from "../types/controllers";
import { AuthenticatedRequestHandler } from "../types/express";
import { handleControllerErrors } from "../util/errors";

export const AccountControllerBase: Controller = {
  postAccount: (async (req, res, next) => {
    res.send("POST /account");
  }) as AuthenticatedRequestHandler,
  patchAccount: (async (req, res, next) => {
    res.send("PATCH /account");
  }) as AuthenticatedRequestHandler,
  deleteAccount: (async (req, res, next) => {
    res.send("DELETE /account");
  }) as AuthenticatedRequestHandler,
};

export default handleControllerErrors(AccountControllerBase);
