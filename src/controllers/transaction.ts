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
    const responseBody: Record<string, any> = {
      message: "Transaction created successfully",
      transactionId: _id,
    };
    await attachNewAccountBalanceToResBody(accountId, responseBody);
    res.status(200).json(responseBody);
  }) as AuthenticatedRequestHandler,
  patchTransaction: (async (req, res, next) => {
    const id = +req.params.id;
    const { userId } = req;
    const { description, amount, date, subcategoryId, accountId } = req.body;

    const [
      originalTransactionData,
      hasTransactionPermissions,
      hasSubcategoryPermissions,
      hasAccountPermissions,
    ] = await Promise.all([
      Transaction.findById(id),
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
    const responseBody: Record<string, any> = {
      message: "Transaction updated successfully",
    };

    const accountIds = [accountId];
    const previousAccountId = originalTransactionData.accountId;
    if (accountId !== previousAccountId) accountIds.push(previousAccountId);
    try {
      responseBody.editedAccounts = await Promise.all(
        accountIds.map(async (id) => {
          const currentBalance = await Account.getCurrentBalance(id);
          return {
            accountId: id,
            currentBalance,
          };
        })
      );
    } catch (err) {
      responseBody.error = {
        message:
          "Internal server error: unable to retrieve current account balance",
      };
    }
    res.status(200).json(responseBody);
  }) as AuthenticatedRequestHandler,
  deleteTransaction: (async (req, res, next) => {
    const { userId } = req;
    const id = +req.params.id;

    const [currentTransaction, hasPermissionToDelete] = await Promise.all([
      Transaction.findById(id),
      User.hasPermissionToEditTransaction(userId, id),
    ]);
    if (!hasPermissionToDelete) throw new ServerError(403, "Access denied");

    await Transaction.removeById(id);
    const responseBody: Record<string, any> = {
      message: "Transaction removed successfully",
    };
    await attachNewAccountBalanceToResBody(
      currentTransaction.accountId,
      responseBody
    );
    res.status(200).json(responseBody);
  }) as AuthenticatedRequestHandler,
};

export default handleControllerErrors(TransactionControllerBase);

async function attachNewAccountBalanceToResBody(
  accountId: number,
  responseBody: Record<string, any>
) {
  try {
    responseBody.currentBalance = await Account.getCurrentBalance(accountId);
  } catch {
    responseBody.error = {
      message:
        "Internal server error: unable to retrieve current account balance",
    };
  }
}
