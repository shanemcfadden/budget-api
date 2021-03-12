import { RequestHandler } from "express";
import Budget from "../models/budget";
import User from "../models/user";
import { CustomRequestHandler } from "../types/express";
import { handleErrors, ServerError } from "../util/errors";

export const getBudgets: CustomRequestHandler = async (req, res, next) => {
  try {
    if (!req.isAuth || !req.userId) {
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
    if (!req.isAuth || !req.userId) {
      throw new ServerError(401, "Unauthenticated user");
    }
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

export const postBudget: CustomRequestHandler = async (req, res, next) => {
  try {
    if (!req.isAuth || !req.userId) {
      throw new ServerError(401, "Unauthenticated user");
    }
    const { title, description } = req.body;
    const budgetId = (await Budget.create({ title, description }))._id;
    const success = await Budget.addUser(budgetId, req.userId);

    res.status(200).json({ budgetId, message: "Budget created successfully" });
  } catch (err) {
    handleErrors(err, next);
  }
};

export const patchBudget: RequestHandler = (req, res, next) => {
  res.send("PATCH /budget/:id");
};

export const deleteBudget: RequestHandler = (req, res, next) => {
  res.send("DELETE /budget/:id");
};
