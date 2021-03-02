import { expect } from "chai";
import { Response, NextFunction } from "express";
import sinon, { SinonStub } from "sinon";
import jwt from "jsonwebtoken";
import isAuth from "../../src/middleware/isAuth";
import { ExtendedRequest } from "../../src/types";

describe("isAuth middleware", () => {
  let req: ExtendedRequest;
  let res: Response;
  let next: SinonStub;

  beforeEach(() => {
    next = sinon.stub();
  });
  afterEach(() => {
    sinon.restore();
  });
  describe("if request has authorization header...", () => {
    beforeEach(() => {
      req = {
        // @ts-ignore
        // TS compiler not reconciling mock req.get() with function overload
        get(name: string): string | undefined {
          if (name === "Authorization") {
            return "Bearer: fakeJWTasdfpoiqerijoijo";
          }
        },
      };
      res = {} as Response;
    });
    describe("if JWT is valid...", () => {
      const mockUserId = "asdfljasdf;lkjasdf";
      beforeEach(() => {
        sinon.stub(jwt, "verify").returns(({
          userId: mockUserId,
        } as unknown) as void); // sinon stubs don't recognize overloads
      });
      it("should attach isAuth=true to request object", () => {
        isAuth(req, res, next as NextFunction);
        expect(req.isAuth).to.be.true;
      });
      it("should attach userId to request object", () => {
        isAuth(req, res, next as NextFunction);
        expect(req.userId).to.equal(mockUserId);
      });
      it("should call next at the end of the middleware", () => {
        isAuth(req, res, next as NextFunction);
        expect(next.calledOnce).to.be.true;
      });
    });
    describe("if JWT is expired", () => {
      it("should not attach isAuth to request object");
      it("should not attach userId to request object");
      it("should call next at the end of the middleware");
    });
    describe("if JWT is not valid...", () => {
      it("should not attach isAuth to request object");
      it("should not attach userId to request object");
      it("should call next at the end of the middleware");
    });
  });
  describe("if request does not have authorization header...", () => {
    it("should not attach isAuth to request object");
    it("should not attach userId to request object");
    it("should call next at the end of the middleware");
  });
});
