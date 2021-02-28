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

export const signup: RequestHandler = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  const user = User.findByEmail(email);
  if (user) {
    const error = new Error("Account for this email already exists");
    next(error);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = await User.create({
    email,
    firstName,
    lastName,
    password: hashedPassword,
  });
  const userId = newUser._id;
  const token = jwt.sign({ userId }, JWT_SECRET!, { expiresIn: "1h" });
  res.status(201).json({ message: "Sign up successful", token });
};
