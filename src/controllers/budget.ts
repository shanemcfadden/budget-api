import Budget from "../models/budget";
import User from "../models/user";
import { AuthenticatedRequestHandler } from "../types/express";
import { catchControllerErrors, ServerError } from "../util/errors";

export const getBudgetsBase: AuthenticatedRequestHandler = async (
  req,
  res,
  next
) => {
  const results = await Budget.findAllByUserId(req.userId!);
  res.status(200).json(results);
};

export const getBudgetBase: AuthenticatedRequestHandler = async (
  req,
  res,
  next
) => {
  const budgetId = +req.params.id;
  const [budgetUsers, budgetData] = await Promise.all([
    User.findAllByBudgetId(budgetId),
    Budget.findDetailsById(budgetId),
  ]);
  if (!budgetUsers.filter((userData) => userData._id === req.userId).length) {
    throw new ServerError(403, "Access denied");
  }
  res.status(200).json(budgetData);
};

// TODO: change status code to 200 with set location header
export const postBudgetBase: AuthenticatedRequestHandler = async (
  req,
  res,
  next
) => {
  const { title, description } = req.body;
  const budgetId = (await Budget.create({ title, description }))._id;
  await Budget.addUser(budgetId, req.userId);
  res.status(200).json({ budgetId, message: "Budget created successfully" });
};

export const patchBudgetBase: AuthenticatedRequestHandler = async (
  req,
  res,
  next
) => {
  const budgetId = +req.params.id;
  const budgetUsers = await User.findAllByBudgetId(budgetId);
  if (!budgetUsers.filter((userData) => userData._id === req.userId).length) {
    throw new ServerError(403, "Access denied");
  }
  const { title, description } = req.body;
  await Budget.update({ id: budgetId, title, description });
  res.status(200).json({ budgetId, message: "Budget updated successfully" });
};

export const deleteBudgetBase: AuthenticatedRequestHandler = async (
  req,
  res,
  next
) => {
  const budgetId = +req.params.id;
  const budgetUsers = await User.findAllByBudgetId(budgetId);
  if (!budgetUsers.filter((userData) => userData._id === req.userId).length) {
    throw new ServerError(403, "Access denied");
  }
  await Budget.removeById(budgetId);
  res.status(200).json({ message: "Budget deleted successfully" });
};

export const deleteBudget = catchControllerErrors(deleteBudgetBase);
export const getBudget = catchControllerErrors(getBudgetBase);
export const getBudgets = catchControllerErrors(getBudgetsBase);
export const patchBudget = catchControllerErrors(patchBudgetBase);
export const postBudget = catchControllerErrors(postBudgetBase);
