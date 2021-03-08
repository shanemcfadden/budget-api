import { RequestHandler } from "express";
import Budget from "../models/budget";
import { CustomRequestHandler } from "../types";
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

export const getBudget: RequestHandler = (req, res, next) => {
  res.send("GET /budget/:id");
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
