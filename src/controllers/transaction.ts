import Account from "../models/account";
import Transaction from "../models/transaction";
import User from "../models/user";
import { Controller } from "../types/controllers";
import { AuthenticatedRequestHandler } from "../types/express";
import { handleControllerErrors, ServerError } from "../util/errors";

export const TransactionControllerBase: Controller = {
  postTransaction: (async (req, res, next) => {
    const { userId } = req;
    const { description, amount, date, subcategoryId, accountId } = req.body;

    const [
      hasSubcategoryPermissions,
      hasAccountPermissions,
    ] = await Promise.all([
      User.hasPermissionToEditSubcategory(userId, subcategoryId),
      User.hasPermissionToEditAccount(userId, accountId),
    ]);

    if (!hasAccountPermissions || !hasSubcategoryPermissions)
      throw new ServerError(403, "Access denied");

    const { _id } = await Transaction.create({
      description,
      amount,
      date,
      subcategoryId,
      accountId,
    });

    let currentBalance: number;
    try {
      currentBalance = await Account.getCurrentBalance(accountId);
    } catch (err) {
      res.status(200).json({
        message: "Transaction created successfully",
        error: {
          message:
            "Internal server error: unable to retrieve current account balance",
        },
      });
      return;
    }
    res.status(200).json({
      message: "Transaction created successfully",
      currentBalance,
      transactionId: _id,
    });
  }) as AuthenticatedRequestHandler,
  patchTransaction: (async (req, res, next) => {
    res.send("PATCH transaction");
  }) as AuthenticatedRequestHandler,
  deleteTransaction: (async (req, res, next) => {
    res.send("DELETE transaction");
  }) as AuthenticatedRequestHandler,
};

export default handleControllerErrors(TransactionControllerBase);
