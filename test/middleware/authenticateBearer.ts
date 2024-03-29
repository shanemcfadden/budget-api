import { expect } from "chai";
import { Response, NextFunction } from "express";
import sinon, { SinonStub } from "sinon";
import jwt from "jsonwebtoken";
import authenticateBearer from "middleware/authenticateBearer";
import { ExtendedRequest } from "types/express";

describe("authenticateBearer middleware", () => {
  let req: ExtendedRequest;
  let res: Response;
  let next: SinonStub;

  beforeEach(() => {
    res = {} as Response;
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
    });
    describe("if JWT is valid...", () => {
      const mockUserId = "asdfljasdf;lkjasdf";
      beforeEach(() => {
        sinon.stub(jwt, "verify").returns(({
          userId: mockUserId,
        } as unknown) as void); // sinon stubs don't recognize overloads
      });
      it("should attach authenticateBearer=true to request object", () => {
        authenticateBearer(req, res, next as NextFunction);
        expect(req.isAuth).to.be.true;
      });
      it("should attach userId to request object", () => {
        authenticateBearer(req, res, next as NextFunction);
        expect(req.userId).to.equal(mockUserId);
      });
      it("should call next at the end of the middleware", () => {
        authenticateBearer(req, res, next as NextFunction);
        expect(next.calledOnce).to.be.true;
      });
    });
    describe("if JWT is expired", () => {
      beforeEach(() => {
        sinon.stub(jwt, "verify").throws({
          name: "TokenExpiredError",
          message: "jwt expired",
          expiredAt: 1408621000,
        });
      });
      it("should not attach authenticateBearer to request object", () => {
        authenticateBearer(req, res, next as NextFunction);
        expect(req.isAuth).to.be.undefined;
      });
      it("should not attach userId to request object", () => {
        authenticateBearer(req, res, next as NextFunction);
        expect(req.userId).to.be.undefined;
      });
      it("should call next at the end of the middleware", () => {
        authenticateBearer(req, res, next as NextFunction);
        expect(next.calledOnce).to.be.true;
      });
    });
    describe("if JWT is not valid...", () => {
      beforeEach(() => {
        sinon.stub(jwt, "verify").throws({
          name: "JsonWebTokenError",
          message: "jwt malformed",
        });
      });
      it("should not attach authenticateBearer to request object", () => {
        authenticateBearer(req, res, next as NextFunction);
        expect(req.isAuth).to.be.undefined;
      });
      it("should not attach userId to request object", () => {
        authenticateBearer(req, res, next as NextFunction);
        expect(req.userId).to.be.undefined;
      });
      it("should call next at the end of the middleware", () => {
        authenticateBearer(req, res, next as NextFunction);
        expect(next.calledOnce).to.be.true;
      });
    });
  });
  describe("if request does not have authorization header...", () => {
    beforeEach(() => {
      req = {
        // @ts-ignore
        // TS compiler not reconciling mock req.get() with function overload
        get(name: string): string | undefined {},
      };
    });
    it("should not attach authenticateBearer to request object", () => {
      authenticateBearer(req, res, next as NextFunction);
      expect(req.isAuth).to.be.undefined;
    });
    it("should not attach userId to request object", () => {
      authenticateBearer(req, res, next as NextFunction);
      expect(req.userId).to.be.undefined;
    });
    it("should call next at the end of the middleware", () => {
      authenticateBearer(req, res, next as NextFunction);
      expect(next.calledOnce).to.be.true;
    });
  });
});
