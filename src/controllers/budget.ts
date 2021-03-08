import { RequestHandler } from "express";

export const getBudgets: RequestHandler = (req, res, next) => {
  res.send("GET /budgets");
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
