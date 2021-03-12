import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { ExtendedRequest } from "../types/express";

const { JWT_SECRET } = process.env;

interface JWTPayload {
  userId?: string;
}

const isAuth = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    next();
    return;
  }
  const token = authHeader.split(" ")[1];

  let payload: JWTPayload;
  try {
    payload = jwt.verify(token, JWT_SECRET!) as JWTPayload;
  } catch (err) {
    next();
    return;
  }
  if (payload.userId) {
    req.isAuth = true;
    req.userId = payload.userId;
  }
  next();
};

export default isAuth;
