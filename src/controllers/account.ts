import Account from "../models/account";
import User from "../models/user";
import { Controller } from "../types/controllers";
import { AuthenticatedRequestHandler } from "../types/express";
import { handleControllerErrors, ServerError } from "../util/errors";

export const AccountControllerBase: Controller = {
  postAccount: (async (req, res, next) => {
    const { name, description, startBalance, startDate, budgetId } = req.body;
    const userHasPermission = await User.hasPermissionToEditBudget(
      req.userId,
      budgetId
    );
    if (!userHasPermission) throw new ServerError(403, "Access denied");
    const newAccountIdPacket = await Account.create({
      name,
      description,
      startBalance,
      startDate: new Date(startDate),
      budgetId,
    });

    res.status(200).json({
      message: "Account created successfully",
      accountId: newAccountIdPacket._id,
    });
  }) as AuthenticatedRequestHandler,
  patchAccount: (async (req, res, next) => {
    res.send("PATCH /account");
  }) as AuthenticatedRequestHandler,
  deleteAccount: (async (req, res, next) => {
    res.send("DELETE /account");
  }) as AuthenticatedRequestHandler,
};

export default handleControllerErrors(AccountControllerBase);
