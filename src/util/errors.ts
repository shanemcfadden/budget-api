import { ErrorRequestHandler, NextFunction, RequestHandler } from "express";
import { AuthenticatedRequestHandler } from "../types/express";

export class ServerError {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

export function catchControllerErrors<T extends AuthenticatedRequestHandler>(
  controller: T
): T {
  return (async (req, res, next) => {
    try {
      await controller(req, res, next);
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
