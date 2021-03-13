import Budget from "../models/budget";
import User from "../models/user";
import { AuthenticatedRequestHandler } from "../types/express";
import { handleErrors, ServerError } from "../util/errors";

export const getBudgets: AuthenticatedRequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const results = await Budget.findAllByUserId(req.userId!);
    res.status(200).json(results);
  } catch (err) {
    handleErrors(err, next);
  }
};

export const getBudget: AuthenticatedRequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const budgetId = +req.params.id;
    const [budgetUsers, budgetData] = await Promise.all([
      User.findAllByBudgetId(budgetId),
      Budget.findDetailsById(budgetId),
    ]);

    if (!budgetUsers.filter((userData) => userData._id === req.userId).length) {
      throw new ServerError(403, "Access denied");
    }

    res.status(200).json(budgetData);
  } catch (err) {
    handleErrors(err, next);
  }
};

// TODO: change status code to 200 with set location header
export const postBudget: AuthenticatedRequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { title, description } = req.body;
    const budgetId = (await Budget.create({ title, description }))._id;
    await Budget.addUser(budgetId, req.userId);
    res.status(200).json({ budgetId, message: "Budget created successfully" });
  } catch (err) {
    handleErrors(err, next);
  }
};

export const patchBudget: AuthenticatedRequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const budgetId = +req.params.id;
    const budgetUsers = await User.findAllByBudgetId(budgetId);
    if (!budgetUsers.filter((userData) => userData._id === req.userId).length) {
      throw new ServerError(403, "Access denied");
    }
    const { title, description } = req.body;
    await Budget.update({ id: budgetId, title, description });
    res.status(200).json({ budgetId, message: "Budget updated successfully" });
  } catch (err) {
    handleErrors(err, next);
  }
};

export const deleteBudget: AuthenticatedRequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const budgetId = +req.params.id;
    const budgetUsers = await User.findAllByBudgetId(budgetId);
    if (!budgetUsers.filter((userData) => userData._id === req.userId).length) {
      throw new ServerError(403, "Access denied");
    }
    await Budget.removeById(budgetId);
    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (err) {
    handleErrors(err, next);
  }
};
