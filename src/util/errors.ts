import { NextFunction } from "express";

export class ServerError {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

export function handleErrors(error: ServerError | Error, next: NextFunction) {
  if (error instanceof ServerError) {
    next(error);
  } else {
    next(new ServerError(500, "Internal server error"));
  }
}
