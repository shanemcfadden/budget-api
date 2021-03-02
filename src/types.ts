import { Request } from "express";

export interface ExtendedRequest extends Request {
  isAuth?: boolean;
  userId?: string;
}
