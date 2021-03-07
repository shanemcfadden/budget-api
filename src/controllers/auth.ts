import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { handleErrors, ServerError } from "../util/errors";

const { JWT_SECRET } = process.env;

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      throw new ServerError(404, "User not found");
    }

    const hashedPassword = user.password;
    const passwordMatches = await bcrypt.compare(password, hashedPassword);
    if (!passwordMatches) {
      throw new ServerError(401, "Authentification failed");
    }

    const userId = user._id;
    const token = jwt.sign({ userId }, JWT_SECRET!, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    handleErrors(err, next);
  }
};

export const signup: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const user = await User.findByEmail(email);
    if (user) {
      throw new ServerError(401, "Account already associated with this email");
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
  } catch (err) {
    handleErrors(err, next);
  }
};
