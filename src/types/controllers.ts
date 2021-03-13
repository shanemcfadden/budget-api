import { RequestHandler } from "express";
import { AuthenticatedRequestHandler, ExtendedRequestHandler } from "./express";

export interface Controller {
  [key: string]:
    | AuthenticatedRequestHandler
    | RequestHandler
    | ExtendedRequestHandler;
}
