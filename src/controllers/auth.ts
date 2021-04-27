import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "models/user";
import { Controller } from "types/controllers";
import { ExtendedRequestHandler } from "types/express";
import { handleControllerErrors, ServerError } from "util/errors";

const { JWT_SECRET } = process.env;

export const AuthControllerBase: Controller = {
  login: (async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) throw new ServerError(404, "User not found");

    const hashedPassword = user.password;
    const passwordMatches = await bcrypt.compare(password, hashedPassword);
    if (!passwordMatches) throw new ServerError(401, "Authentification failed");

    const userId = user._id;
    const token = jwt.sign({ userId }, JWT_SECRET!, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
  }) as ExtendedRequestHandler,

  signup: (async (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;
    const user = await User.findByEmail(email);
    if (user)
      throw new ServerError(401, "Account already associated with this email");

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
  }) as ExtendedRequestHandler,
};

export default handleControllerErrors(AuthControllerBase);
