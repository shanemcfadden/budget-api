import { expect } from "chai";
import { Response, NextFunction } from "express";
import Sinon from "sinon";
import mustBeAuthenticated from "../../src/middleware/mustBeAuthenticated";
import { ExtendedRequest } from "../../src/types/express";
import { ServerError } from "../../src/util/errors";

describe("mustBeAuthenticated()", () => {
  let req: ExtendedRequest;
  const res = {} as Response;
  const next = Sinon.spy();
  const fakeUserId = "1234fvuiwqe";

  describe("if req.isAuth is undefined...", () => {
    beforeEach(() => {
      req = {
        userId: fakeUserId,
      } as ExtendedRequest;
    });
    it('should throw a 401 "Unauthenticated user" server error', () => {
      try {
        mustBeAuthenticated(req, res, next as NextFunction);
        throw new Error("mustBeAuthenticated should have thrown an error");
      } catch (err) {
        expect(err).to.deep.equal(new ServerError(401, "Unauthenticated user"));
      }
    });
    it("should not call next()", () => {
      try {
        mustBeAuthenticated(req, res, next as NextFunction);
      } finally {
        expect(next.calledOnce).to.be.true;
      }
    });
  });
  describe("if req.userId is undefined...", () => {
    beforeEach(() => {
      req = {
        isAuth: true,
      } as ExtendedRequest;
    });
    it('should throw a 401 "Unauthenticated user" error', () => {
      try {
        mustBeAuthenticated(req, res, next as NextFunction);
        throw new Error("mustBeAuthenticated should have thrown an error");
      } catch (err) {
        expect(err).to.deep.equal(new ServerError(401, "Unauthenticated user"));
      }
    });
    it("should not call next()", () => {
      try {
        mustBeAuthenticated(req, res, next as NextFunction);
      } finally {
        expect(next.calledOnce).to.be.true;
      }
    });
  });
  describe("if req.isAuth is true and req.userId is defined...", () => {
    beforeEach(() => {
      req = {
        isAuth: true,
        userId: fakeUserId,
      } as ExtendedRequest;
    });
    it("should not throw an error", () => {
      mustBeAuthenticated(req, res, next as NextFunction);
    });
    it("should call next", () => {
      mustBeAuthenticated(req, res, next as NextFunction);
      expect(next.calledOnce).to.be.true;
    });
    it("should not alter isAuth", () => {
      mustBeAuthenticated(req, res, next as NextFunction);
      expect(req.isAuth).to.be.true;
    });
    it("should not alter userId", () => {
      mustBeAuthenticated(req, res, next as NextFunction);
      expect(req.userId).to.equal(fakeUserId);
    });
  });
});
