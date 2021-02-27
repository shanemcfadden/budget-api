import { Request, Response } from "express";

export const login = (req: Request, res: Response) => {
  res.send("POST /auth/login");
};

export const signup = (req: Request, res: Response) => {
  res.send("PUT /auth/signup");
};
