import { RequestHandler } from "express";

export const login: RequestHandler = (req, res, next) => {
  res.status(200).json({ message: "Login successful" });
};

export const signup: RequestHandler = (req, res) => {
  res.send("PUT /auth/signup");
};
