import Budget from "models/budget";
import User from "models/user";
import { Controller } from "types/controllers";
import { AuthenticatedRequestHandler } from "types/express";
import { handleControllerErrors, ServerError } from "util/errors";

export const BudgetControllerBase: Controller = {
  getBudgets: (async (req, res, next) => {
    const results = await Budget.findAllByUserId(req.userId!);
    res.status(200).json(results);
  }) as AuthenticatedRequestHandler,

  getBudget: (async (req, res, next) => {
    const budgetId = +req.params.id;
    const [budgetUsers, budgetData] = await Promise.all([
      User.findAllByBudgetId(budgetId),
      Budget.findDetailsById(budgetId),
    ]);
    if (!budgetUsers.filter((userData) => userData._id === req.userId).length) {
      throw new ServerError(403, "Access denied");
    }
    res.status(200).json(budgetData);
  }) as AuthenticatedRequestHandler,

  // TODO: change status code to 200 with set location header
  postBudget: (async (req, res, next) => {
    const { title, description } = req.body;
    const budgetId = (await Budget.create({ title, description }))._id;
    await Budget.addUser(budgetId, req.userId);
    res.status(200).json({ budgetId, message: "Budget created successfully" });
  }) as AuthenticatedRequestHandler,

  patchBudget: (async (req, res, next) => {
    const budgetId = +req.params.id;
    const budgetUsers = await User.findAllByBudgetId(budgetId);
    if (!budgetUsers.filter((userData) => userData._id === req.userId).length) {
      throw new ServerError(403, "Access denied");
    }
    const { title, description } = req.body;
    await Budget.update({ id: budgetId, title, description });
    res.status(200).json({ budgetId, message: "Budget updated successfully" });
  }) as AuthenticatedRequestHandler,

  deleteBudget: (async (req, res, next) => {
    const budgetId = +req.params.id;
    const budgetUsers = await User.findAllByBudgetId(budgetId);
    if (!budgetUsers.filter((userData) => userData._id === req.userId).length) {
      throw new ServerError(403, "Access denied");
    }
    await Budget.removeById(budgetId);
    res.status(200).json({ message: "Budget deleted successfully" });
  }) as AuthenticatedRequestHandler,
};

export default handleControllerErrors(BudgetControllerBase);
