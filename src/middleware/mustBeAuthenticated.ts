import { Response, NextFunction } from "express";
import { ExtendedRequest } from "types/express";
import { ServerError } from "util/errors";

const mustBeAuthenticated = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuth || !req.userId) {
    throw new ServerError(401, "Unauthenticated user");
  }
  next();
};

export default mustBeAuthenticated;
