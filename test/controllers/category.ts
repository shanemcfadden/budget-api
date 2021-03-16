import { NextFunction, Response } from "express";
import Sinon, { SinonStub } from "sinon";
import { AuthenticatedRequest } from "../../src/types/express";
import { MockResponse } from "../types";
import User from "../../src/models/user";
import * as Errors from "../../src/util/errors";
import { fakeCategories, fakeUser, mockInternalServerError } from "../fixtures";
import { CategoryControllerBase } from "../../src/controllers/category";
import { expect } from "chai";
import Category from "../../src/models/category";

const { postCategory, patchCategory, deleteCategory } = CategoryControllerBase;

describe("CategoryController", () => {
  const fakeCategory = fakeCategories[0];
  const { id, description, isIncome, budgetId } = fakeCategory;
  const error403 = new Errors.ServerError(403, "Access denied");
  let req: AuthenticatedRequest;
  let res: MockResponse;
  const next = (() => {}) as NextFunction;
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
    Sinon.restore();
  });
  describe("postCategory()", () => {
    beforeEach(() => {
      req = {
        userId: fakeUser._id,
        isAuth: true,
        body: {
          description,
          isIncome,
          budgetId,
        },
      } as AuthenticatedRequest;
    });
    describe("If user has permission to edit the given budget...", () => {
      let categoryCreateStub: SinonStub;
      const fakeBudgetId = 1234553;
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditBudget").resolves(true);
      });
      describe("if the category creation is successful...", () => {
        beforeEach(() => {
          categoryCreateStub = Sinon.stub(Category, "create").resolves({
            _id: id,
          });
        });
        it("should create the category", async () => {
          await postCategory(req, res as Response, next);
          expect(categoryCreateStub.calledOnce).to.be.true;
          expect(
            categoryCreateStub.calledOnceWith({
              description,
              isIncome,
              budgetId,
            })
          ).to.be.true;
        });
        it("should send a 200 response", async () => {
          await postCategory(req, res as Response, next);
          expect(res.statusCode).to.equal(200);
        });
        it("should have a succcess message in the response body", async () => {
          await postCategory(req, res as Response, next);
          expect(res.body?.message).to.equal("Category created successfully");
        });
        it("should have the new category id in the response body", async () => {
          await postCategory(req, res as Response, next);
          expect(res.body?.categoryId!).to.equal(id);
        });
      });
      describe("if the category creation is not successful...", () => {
        beforeEach(() => {
          categoryCreateStub = Sinon.stub(Category, "create").rejects(
            mockInternalServerError
          );
        });
        it("should throw the error rejected by the category creation", async () => {
          try {
            await postCategory(req, res as Response, next);
            throw new Error("postCategory should reject");
          } catch (err) {
            expect(err).to.deep.equal(mockInternalServerError);
          }
        });
        it("should not send a response", async () => {
          try {
            await postCategory(req, res as Response, next);
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
    });
    describe("If user does not have permission to edit the given budget...", () => {
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditBudget").resolves(false);
      });
      it("should throw a 403 error", async () => {
        try {
          await postCategory(req, res as Response, next);
          throw new Error("postCategory should reject");
        } catch (err) {
          expect(err).to.deep.equal(error403);
        }
      });
      it("should not send a response", async () => {
        try {
          await postCategory(req, res as Response, next);
        } catch {
        } finally {
          expect(res.statusCode).to.be.undefined;
          expect(res.body).to.be.undefined;
        }
      });
    });
  });
  // describe('patchCategory()')
  // describe('deleteCategory()')
});
