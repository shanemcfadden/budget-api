import { RequestHandler } from "express";

export const login: RequestHandler = (req, res, next) => {
  res.send("POST /auth/login");
};

export const signup: RequestHandler = (req, res) => {
  res.send("PUT /auth/signup");
};
