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
    const id = +req.params.id;
    const { userId } = req;
    const { description, amount, date, subcategoryId, accountId } = req.body;

    const [
      hasTransactionPermissions,
      hasSubcategoryPermissions,
      hasAccountPermissions,
    ] = await Promise.all([
      User.hasPermissionToEditTransaction(userId, id),
      User.hasPermissionToEditSubcategory(userId, subcategoryId),
      User.hasPermissionToEditAccount(userId, accountId),
    ]);

    if (
      !hasTransactionPermissions ||
      !hasAccountPermissions ||
      !hasSubcategoryPermissions
    )
      throw new ServerError(403, "Access denied");

    await Transaction.update({
      id,
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
        message: "Transaction updated successfully",
        error: {
          message:
            "Internal server error: unable to retrieve current account balance",
        },
      });
      return;
    }
    res.status(200).json({
      message: "Transaction updated successfully",
      currentBalance,
    });
  }) as AuthenticatedRequestHandler,
  deleteTransaction: (async (req, res, next) => {
    const { userId } = req;
    const id = +req.params.id;

    const hasPermissionToDelete = await User.hasPermissionToEditTransaction(
      userId,
      id
    );
    if (!hasPermissionToDelete) throw new ServerError(403, "Access denied");

    await Transaction.removeById(id);
    res.status(200).json({ message: "Transaction removed successfully" });
  }) as AuthenticatedRequestHandler,
};

export default handleControllerErrors(TransactionControllerBase);
