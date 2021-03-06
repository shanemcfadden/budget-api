import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

const { JWT_SECRET } = process.env;

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      const error = {
        statusCode: 404,
        message: "User not found",
      };
      next(error);
      return;
    }

    const hashedPassword = user.password;
    const passwordMatches = await bcrypt.compare(password, hashedPassword);
    if (!passwordMatches) {
      const error = {
        statusCode: 401,
        message: "Authentication failed",
      };
      next(error);
      return;
    }

    const userId = user._id;
    const token = jwt.sign({ userId }, JWT_SECRET!, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
  } catch {
    next({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

export const signup: RequestHandler = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (user) {
      const error = {
        statusCode: 401,
        message: "Account already associated with this email",
      };
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
  } catch {
    next({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};
