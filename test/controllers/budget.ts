import { expect } from "chai";
import { NextFunction, Response } from "express";
import sinon, { SinonSpy } from "sinon";
import { getBudget, getBudgets } from "../../src/controllers/budget";
import { ExtendedRequest } from "../../src/types/express";
import { MockResponse } from "../types";
import Budget from "../../src/models/budget";
import * as Errors from "../../src/util/errors";
import { fakeCompleteBudgetData, fakeUserMinusPassword } from "../fixtures";
import User from "../../src/models/user";

describe("Budget controller", () => {
  let req: ExtendedRequest;
  let res: MockResponse;
  const next = (() => {}) as NextFunction;
  let errorHandlerSpy: SinonSpy;

  beforeEach(() => {
    res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (object) {
        this.body = object;
        return;
      },
    };
    errorHandlerSpy = sinon.spy(Errors, "handleErrors");
  });
  afterEach(() => {
    sinon.restore();
  });
  describe("getBudgets()", () => {
    describe("if user is not authenticated...", () => {
      beforeEach(() => {
        req = {} as ExtendedRequest;
      });
      it("should throw an authentication error", async () => {
        await getBudgets(req, res as Response, next);
        expect(errorHandlerSpy.calledOnce).to.be.true;
        const error = errorHandlerSpy.getCall(0).args[0];
        expect(error.statusCode).to.equal(401);
        expect(error.message).to.equal("Unauthenticated user");
      });
      it("should not send a response", async () => {
        await getBudgets(req, res as Response, next);
        expect(res.statusCode).to.be.undefined;
        expect(res.body).to.be.undefined;
      });
    });
    describe("if user is authenticated...", () => {
      beforeEach(() => {
        req = {
          isAuth: true,
          userId: "asdriou2342",
        } as ExtendedRequest;
      });
      describe("if Budget model resolves...", () => {
        const fakeBudgetResults = [
          { id: 2, title: "Vacation budget", description: "Cannot wait" },
          { id: 5, title: "Household items" },
        ];
        beforeEach(() => {
          sinon.stub(Budget, "findAllByUserId").resolves(fakeBudgetResults);
        });
        it("should send a 200 response with the resolved results", async () => {
          await getBudgets(req, res as Response, next);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.deep.equal(fakeBudgetResults);
        });
      });
      describe("if Budget model rejects...", () => {
        const mockError = new Errors.ServerError(500, "This is a mock error");
        beforeEach(() => {
          sinon.stub(Budget, "findAllByUserId").rejects(mockError);
        });
        it("should throw the rejected error", async () => {
          await getBudgets(req, res as Response, next);
          expect(errorHandlerSpy.calledOnce).to.be.true;
          const error = errorHandlerSpy.getCall(0).args[0];
          expect(error).to.deep.equal(mockError);
        });
      });
    });
  });
  describe("getBudget()", () => {
    describe("if user is not authenticated...", () => {
      beforeEach(() => {
        req = ({
          params: {
            id: "243",
          },
        } as unknown) as ExtendedRequest;
      });
      it("should throw an authentication error", async () => {
        await getBudget(req, res as Response, next);
        expect(errorHandlerSpy.calledOnce).to.be.true;
        const error = errorHandlerSpy.getCall(0).args[0];
        expect(error.statusCode).to.equal(401);
        expect(error.message).to.equal("Unauthenticated user");
      });
      it("should not send a response", async () => {
        await getBudget(req, res as Response, next);
        expect(res.statusCode).to.be.undefined;
        expect(res.body).to.be.undefined;
      });
    });
    describe("if user is authenticated...", () => {
      beforeEach(() => {
        req = ({
          isAuth: true,
          userId: fakeUserMinusPassword._id,
          params: {
            id: fakeCompleteBudgetData.id.toString(),
          },
        } as unknown) as ExtendedRequest;
      });
      describe("if budget exists...", () => {
        beforeEach(() => {
          sinon
            .stub(Budget, "findDetailsById")
            .resolves(fakeCompleteBudgetData);
        });
        describe("if user has permission to get budget...", () => {
          beforeEach(() => {
            sinon
              .stub(User, "findAllByBudgetId")
              .resolves([fakeUserMinusPassword]);
          });
          it("should send a 200 response", async () => {
            await getBudget(req, res as Response, next);
            expect(res.statusCode).to.exist;
            expect(res.statusCode).to.equal(200);
          });
          it("should return budget data in the response json", async () => {
            await getBudget(req, res as Response, next);
            expect(res.body).to.exist;
            expect(res.body).to.deep.equal(fakeCompleteBudgetData);
          });
        });
        describe("if user does not have permission to get budget", () => {
          beforeEach(() => {
            sinon.stub(User, "findAllByBudgetId").resolves([
              {
                _id: "1234767652a1",
                email: "asdfrew@basdr.com",
                firstName: "NotAnAuthorized",
                lastName: "User",
              },
            ]);
          });
          it("should throw an error", async () => {
            await getBudget(req, res as Response, next);
            expect(errorHandlerSpy.calledOnce).to.be.true;
            const error = errorHandlerSpy.getCall(0).args[0];
            expect(error.statusCode).to.equal(403);
            expect(error.message).to.equal("Access denied");
          });
          it("should not send a response", async () => {
            await getBudget(req, res as Response, next);
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          });
        });
      });
      describe("if budget does not exist...", () => {
        const budgetNotFoundError = new Errors.ServerError(
          404,
          "Budget not found"
        );
        beforeEach(() => {
          sinon.stub(Budget, "findDetailsById").rejects(budgetNotFoundError);
          sinon
            .stub(User, "findAllByBudgetId")
            .resolves([fakeUserMinusPassword]);
        });
        it("should pass along error received by first rejected promise", async () => {
          await getBudget(req, res as Response, next);
          expect(errorHandlerSpy.calledOnce).to.be.true;
          const error = errorHandlerSpy.getCall(0).args[0];
          expect(error).to.deep.equal(budgetNotFoundError);
        });
        it("should not send a response", async () => {
          await getBudget(req, res as Response, next);
          expect(res.statusCode).to.be.undefined;
          expect(res.body).to.be.undefined;
        });
      });
    });
  });
  //   describe("postBudget()");
  //   describe("patchBudget()");
  //   describe("deleteBudget()");
});
