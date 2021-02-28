import bcrypt, { hash } from "bcrypt";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

const { JWT_SECRET } = process.env;

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  const user = User.findByEmail(email);

  if (!user) {
    const error = new Error("Incorrect email or password");
    next(error);
    return;
  }

  const hashedPassword = user.password;

  const passwordMatches = await bcrypt.compare(password, hashedPassword);

  if (!passwordMatches) {
    const error = new Error("Incorrect email or password");
    next(error);
    console.log("password error");
    return;
  }

  const userId = user._id;
  const token = jwt.sign({ userId }, JWT_SECRET!, { expiresIn: "1h" });
  res.status(200).json({ message: "Login successful", token });
};

export const signup: RequestHandler = (req, res) => {
  res.send("PUT /auth/signup");
};
