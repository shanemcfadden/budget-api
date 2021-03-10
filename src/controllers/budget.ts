import { RequestHandler } from "express";
import Account from "../models/account";
import Budget from "../models/budget";
import MacroCategory from "../models/macro-category";
import MicroCategory from "../models/micro-category";
import Transaction from "../models/transaction";
import { CustomRequestHandler } from "../types/express";
import { ExtensiveBudgetData } from "../types/models";
import { handleErrors, ServerError } from "../util/errors";

export const getBudgets: CustomRequestHandler = async (req, res, next) => {
  try {
    if (!req.isAuth) {
      throw new ServerError(401, "Unauthenticated user");
    }
    if (!req.userId) {
      throw new ServerError(401, "Unauthenticated user");
    }
    const results = await Budget.findAllByUserId(req.userId);
    res.status(200).json(results);
  } catch (err) {
    handleErrors(err, next);
  }
};

export const getBudget: CustomRequestHandler = async (req, res, next) => {
  try {
    if (!req.isAuth) {
      throw new ServerError(401, "Unauthenticated user");
    }
    if (!req.userId) {
      throw new ServerError(401, "Unauthenticated user");
    }
    const budgetId = +req.params.id;
    const [
      userBudgets,
      budget,
      accounts,
      transactions,
      categories,
    ] = await Promise.all([
      Budget.findAllByUserId(req.userId),
      Budget.findById(budgetId),
      Account.findAllByBudgetId(budgetId),
      Transaction.findAllByBudgetId(budgetId),
      MacroCategory.findAllByBudgetIdWithMicroCategories(budgetId),
    ]);

    const matchingBudgets = userBudgets.filter(({ id }) => id === budgetId);
    if (!matchingBudgets.length) throw new ServerError(403, "Access denied");

    const accountDictionary = accounts.reduce(
      (
        dictionary,
        { id, name, description, startDate, startBalance, currentBalance }
      ) => {
        dictionary[id] = {
          name,
          description,
          startBalance,
          startDate,
          currentBalance,
        };
        return dictionary;
      },
      {}
    );

    res.status(200).json({
      budget,
      accountDictionary,
      transactions,
      categories,
    });
  } catch (err) {
    handleErrors(err, next);
  }
};

export const postBudget: RequestHandler = (req, res, next) => {
  res.send("POST /budget");
};

export const patchBudget: RequestHandler = (req, res, next) => {
  res.send("PATCH /budget/:id");
};

export const deleteBudget: RequestHandler = (req, res, next) => {
  res.send("DELETE /budget/:id");
};