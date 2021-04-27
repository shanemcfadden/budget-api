import { RequestHandler } from "express";
import {
  AuthenticatedRequestHandler,
  ExtendedRequestHandler,
} from "types/express";

export interface Controller {
  [key: string]:
    | AuthenticatedRequestHandler
    | RequestHandler
    | ExtendedRequestHandler;
}
