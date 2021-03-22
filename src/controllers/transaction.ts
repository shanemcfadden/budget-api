import Transaction from "../models/transaction";
import User from "../models/user";
import { Controller } from "../types/controllers";
import { AuthenticatedRequestHandler } from "../types/express";
import { handleControllerErrors, ServerError } from "../util/errors";

export const TransactionControllerBase: Controller = {
  postTransaction: (async (req, res, next) => {
    res.send("POST transaction");
  }) as AuthenticatedRequestHandler,
  patchTransaction: (async (req, res, next) => {
    res.send("PATCH transaction");
  }) as AuthenticatedRequestHandler,
  deleteTransaction: (async (req, res, next) => {
    res.send("DELETE transaction");
  }) as AuthenticatedRequestHandler,
};

export default handleControllerErrors(TransactionControllerBase);
