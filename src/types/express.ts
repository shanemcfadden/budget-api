import { NextFunction, Request, Response } from "express";

export interface ExtendedRequest extends Request {
  isAuth?: boolean;
  userId?: string;
}

export interface ExtendedRequestHandler {
  (req: ExtendedRequest, res: Response, next: NextFunction): void;
}

export interface AuthenticatedRequest extends Request {
  isAuth: true;
  userId: string;
}

export interface AuthenticatedRequestHandler {
  (req: AuthenticatedRequest, res: Response, next: NextFunction): void;
}
