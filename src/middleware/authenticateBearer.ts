import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { ExtendedRequest } from "types/express";

const { JWT_SECRET } = process.env;

interface JWTPayload {
  userId?: string;
}

const authenticateBearer = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    let payload: JWTPayload;
    try {
      // jwt.verify() will throw error if token is invalid
      payload = jwt.verify(token, JWT_SECRET!) as JWTPayload;
      if (payload.userId) {
        req.isAuth = true;
        req.userId = payload.userId;
      }
    } catch {}
  }
  next();
};

export default authenticateBearer;
