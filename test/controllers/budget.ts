import { expect } from "chai";
import { NextFunction, Response } from "express";
import sinon from "sinon";
import { BudgetControllerBase } from "controllers/budget";
import { AuthenticatedRequest } from "types/express";
import { MockResponse } from "../types";
import Budget from "models/budget";
import * as Errors from "util/errors";
import {
  fakeCompleteBudgetData,
  fakeUserMinusPassword,
  mockInternalServerError,
} from "../fixtures";
import User from "models/user";

const {
  getBudget,
  getBudgets,
  postBudget,
  patchBudget,
  deleteBudget,
} = BudgetControllerBase;

describe("Budget controller", () => {
  let req: AuthenticatedRequest;
  let res: MockResponse;
  const next = (() => {}) as NextFunction;
  const error403 = new Errors.ServerError(403, "Access denied");

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
  });
  afterEach(() => {
    sinon.restore();
  });
  describe("getBudgets()", () => {
    beforeEach(() => {
      req = {
        isAuth: true,
        userId: "asdriou2342",
      } as AuthenticatedRequest;
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
      beforeEach(() => {
        sinon.stub(Budget, "findAllByUserId").rejects(mockInternalServerError);
      });
      it("should throw the rejected error", async () => {
        try {
          await getBudgets(req, res as Response, next);
          throw new Error("getBudgets should reject");
        } catch (err) {
          expect(err).to.deep.equal(mockInternalServerError);
        }
      });
    });
  });
  describe("getBudget()", () => {
    beforeEach(() => {
      req = ({
        isAuth: true,
        userId: fakeUserMinusPassword._id,
        params: {
          id: fakeCompleteBudgetData.id.toString(),
        },
      } as unknown) as AuthenticatedRequest;
    });
    describe("if budget exists...", () => {
      beforeEach(() => {
        sinon.stub(Budget, "findDetailsById").resolves(fakeCompleteBudgetData);
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
          try {
            await getBudget(req, res as Response, next);
            throw new Error("getBudget should reject");
          } catch (err) {
            expect(err).to.deep.equal(error403);
          }
        });
        it("should not send a response", async () => {
          try {
            await getBudget(req, res as Response, next);
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
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
        sinon.stub(User, "findAllByBudgetId").resolves([fakeUserMinusPassword]);
      });
      it("should pass along error received by first rejected promise", async () => {
        try {
          await getBudget(req, res as Response, next);
          throw new Error("getBudget should reject");
        } catch (err) {
          expect(err).to.deep.equal(budgetNotFoundError);
        }
      });
      it("should not send a response", async () => {
        try {
          await getBudget(req, res as Response, next);
        } catch {
        } finally {
          expect(res.statusCode).to.be.undefined;
          expect(res.body).to.be.undefined;
        }
      });
    });
  });
  describe("postBudget()", () => {
    beforeEach(() => {
      req = ({
        isAuth: true,
        userId: fakeUserMinusPassword._id,
        body: {
          title: fakeCompleteBudgetData.title,
          description: fakeCompleteBudgetData.description,
        },
      } as unknown) as AuthenticatedRequest;
    });
    describe("if budget is created successfully...", () => {
      beforeEach(() => {
        sinon
          .stub(Budget, "create")
          .resolves({ _id: fakeCompleteBudgetData.id });
      });
      describe("if user is added to budget successfully...", () => {
        beforeEach(() => {
          sinon.stub(Budget, "addUser").resolves(true);
        });
        it("should respond with a status code of 200", async () => {
          await postBudget(req, res as Response, next);
          expect(res.statusCode).to.exist;
          expect(res.statusCode).to.equal(200);
        });
        it("should respond with a success message in the body", async () => {
          await postBudget(req, res as Response, next);
          expect(res.body?.message).to.equal("Budget created successfully");
        });
        it("should respond with the new budget id in the body", async () => {
          await postBudget(req, res as Response, next);
          expect(res.body?.budgetId).to.equal(fakeCompleteBudgetData.id);
        });
      });
      describe("if user is not added successfully...", () => {
        beforeEach(() => {
          sinon.stub(Budget, "addUser").rejects(mockInternalServerError);
        });
        it("should pass along error received by first rejected promise", async () => {
          try {
            await postBudget(req, res as Response, next);
            throw new Error("postBudget should reject");
          } catch (err) {
            expect(err).to.deep.equal(mockInternalServerError);
          }
        });
        it("should not send a response", async () => {
          try {
            await postBudget(req, res as Response, next);
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
    });
    describe("if budget is not created...", () => {
      beforeEach(() => {
        sinon.stub(Budget, "create").rejects(mockInternalServerError);
      });
      it("should pass along error received by first rejected promise", async () => {
        try {
          await postBudget(req, res as Response, next);
          throw new Error("postBudget should reject");
        } catch (err) {
          expect(err).to.deep.equal(mockInternalServerError);
        }
      });
      it("should not send a response", async () => {
        try {
          await postBudget(req, res as Response, next);
        } catch {
        } finally {
          expect(res.statusCode).to.be.undefined;
          expect(res.body).to.be.undefined;
        }
      });
    });
  });
  describe("patchBudget()", () => {
    beforeEach(() => {
      req = ({
        userId: fakeUserMinusPassword._id,
        isAuth: true,
        body: {
          title: "new title",
          description: "new description",
        },
        params: {
          id: fakeCompleteBudgetData.id.toString(),
        },
      } as unknown) as AuthenticatedRequest;
    });
    describe("if user is authorized to edit the budget...", () => {
      beforeEach(() => {
        sinon.stub(User, "findAllByBudgetId").resolves([fakeUserMinusPassword]);
      });
      describe("if budget is patched successfully...", () => {
        beforeEach(() => {
          sinon.stub(Budget, "update").resolves(true);
        });
        it("should send a 200 response", async () => {
          await patchBudget(req, res as Response, next);
          expect(res.statusCode).to.equal(200);
        });
        it("should send a success message", async () => {
          await patchBudget(req, res as Response, next);
          expect(res.body?.message).to.equal("Budget updated successfully");
        });
        it("should include budget id in the response json", async () => {
          await patchBudget(req, res as Response, next);
          expect(res.body?.budgetId).to.equal(fakeCompleteBudgetData.id);
        });
      });
      describe("if budget is not patched successfully...", () => {
        beforeEach(() => {
          sinon.stub(Budget, "update").rejects(mockInternalServerError);
        });
        it("should pass along the given error", async () => {
          try {
            await patchBudget(req, res as Response, next);
            throw new Error("patchBudget should reject");
          } catch (err) {
            expect(err).to.deep.equal(mockInternalServerError);
          }
        });
        it("should not send a response", async () => {
          try {
            await patchBudget(req, res as Response, next);
          } catch {
          } finally {
            expect(res.body).to.be.undefined;
            expect(res.statusCode).to.be.undefined;
          }
        });
      });
    });
    describe("if user is not authorized to edit the budget...", () => {
      beforeEach(() => {
        sinon.stub(User, "findAllByBudgetId").resolves([
          {
            _id: "asdflkj21kl1239",
            email: "wrong@user.com",
            firstName: "NotAuthorized",
            lastName: "User",
          },
        ]);
      });
      it("should send a 403 error", async () => {
        try {
          await patchBudget(req, res as Response, next);
          throw new Error("patchBudget should reject");
        } catch (err) {
          expect(err).to.deep.equal(error403);
        }
      });
      it("should not send a response", async () => {
        try {
          await patchBudget(req, res as Response, next);
        } catch {
        } finally {
          expect(res.body).to.be.undefined;
          expect(res.statusCode).to.be.undefined;
        }
      });
    });
  });
  describe("deleteBudget()", () => {
    beforeEach(() => {
      req = ({
        userId: fakeUserMinusPassword._id,
        isAuth: true,
        params: {
          id: fakeCompleteBudgetData.id.toString(),
        },
      } as unknown) as AuthenticatedRequest;
    });
    describe("if user is authorized to edit the budget...", () => {
      beforeEach(() => {
        sinon.stub(User, "findAllByBudgetId").resolves([fakeUserMinusPassword]);
      });
      describe("if budget is deleted successfully...", () => {
        beforeEach(() => {
          sinon.stub(Budget, "removeById").resolves(true);
        });
        it("should send a 200 response", async () => {
          await deleteBudget(req, res as Response, next);
          expect(res.statusCode).to.equal(200);
        });
        it("should send a success message", async () => {
          await deleteBudget(req, res as Response, next);
          expect(res.body?.message).to.equal("Budget deleted successfully");
        });
      });
      describe("if budget is not deleted successfully...", () => {
        beforeEach(() => {
          sinon.stub(Budget, "removeById").rejects(mockInternalServerError);
        });
        it("should pass along the given error", async () => {
          try {
            await deleteBudget(req, res as Response, next);
            throw new Error("deleteBudget should reject");
          } catch (err) {
            expect(err).to.deep.equal(mockInternalServerError);
          }
        });
        it("should not send a response", async () => {
          try {
            await deleteBudget(req, res as Response, next);
          } catch {
          } finally {
            expect(res.body).to.be.undefined;
            expect(res.statusCode).to.be.undefined;
          }
        });
      });
    });
    describe("if user is not authorized to edit the budget...", () => {
      beforeEach(() => {
        sinon.stub(User, "findAllByBudgetId").resolves([
          {
            _id: "asdflkj21kl1239",
            email: "wrong@user.com",
            firstName: "NotAuthorized",
            lastName: "User",
          },
        ]);
      });
      it("should send a 403 error", async () => {
        try {
          await deleteBudget(req, res as Response, next);
          throw new Error("deleteBudget should reject");
        } catch (err) {
          expect(err).to.deep.equal(error403);
        }
      });
      it("should not send a response", async () => {
        try {
          await deleteBudget(req, res as Response, next);
        } catch {
        } finally {
          expect(res.body).to.be.undefined;
          expect(res.statusCode).to.be.undefined;
        }
      });
    });
  });
});
