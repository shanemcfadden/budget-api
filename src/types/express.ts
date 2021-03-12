import { NextFunction, Request, Response } from "express";

export interface ExtendedRequest extends Request {
  isAuth?: boolean;
  userId?: string;
}

export interface CustomRequestHandler {
  (req: ExtendedRequest, res: Response, next: NextFunction): void;
}
