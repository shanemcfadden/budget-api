import { ErrorRequestHandler, NextFunction, Response } from "express";
import { Controller } from "../types/controllers";
import {
  AuthenticatedRequest,
  AuthenticatedRequestHandler,
  ExtendedRequest,
  ExtendedRequestHandler,
} from "../types/express";

export class ServerError {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

export function handleControllerErrors(controller: Controller): Controller {
  const newController: Controller = {};
  Object.keys(controller).forEach((key) => {
    newController[key] = handleMiddlewareErrors(controller[key]);
  });
  return newController;
}

export function handleMiddlewareErrors<
  T extends AuthenticatedRequestHandler | ExtendedRequestHandler
>(middleware: T): T {
  return (async (
    req: T extends AuthenticatedRequestHandler
      ? AuthenticatedRequest
      : ExtendedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await middleware(req, res, next);
    } catch (err) {
      handleErrors(err, next);
    }
  }) as T;
}

export function handleErrors(error: ServerError | Error, next: NextFunction) {
  if (error instanceof ServerError) {
    next(error);
  } else {
    console.log(error);
    next(new ServerError(500, "Internal server error"));
  }
}

export const errorRequestHandler: ErrorRequestHandler = function (
  error,
  req,
  res,
  next
) {
  res.status(error.statusCode).json({
    error: {
      message: error.message,
      path: req.path,
      method: req.method,
      time: Date(),
    },
  });
};
