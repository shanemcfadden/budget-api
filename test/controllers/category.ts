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
  describe("patchCategory()", () => {
    beforeEach(() => {
      req = ({
        isAuth: true,
        userId: fakeUser._id,
        body: {
          description,
          isIncome,
        },
        params: {
          id: id.toString(),
        },
      } as unknown) as AuthenticatedRequest;
    });
    describe("if user is authorized to update the category...", () => {
      let categoryUpdateStub: SinonStub;
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditCategory").resolves(true);
      });
      describe("if the category update is successful...", () => {
        beforeEach(() => {
          categoryUpdateStub = Sinon.stub(Category, "update").resolves(true);
        });
        it("should update the category", async () => {
          await patchCategory(req, res as Response, next);
          expect(categoryUpdateStub.calledOnce).to.be.true;
          expect(
            categoryUpdateStub.calledOnceWith({ id, description, isIncome })
          ).to.be.true;
        });
        it("should send a 200 response", async () => {
          await patchCategory(req, res as Response, next);
          expect(res.statusCode).to.equal(200);
        });
        it("should send a success message in the response body", async () => {
          await patchCategory(req, res as Response, next);
          expect(res.body?.message).to.equal("Category updated successfully");
        });
      });
      describe("if the category update is unsuccessful...", () => {
        beforeEach(() => {
          categoryUpdateStub = Sinon.stub(Category, "update").rejects(
            mockInternalServerError
          );
        });
        it("should throw the error thrown by the update function", async () => {
          try {
            await patchCategory(req, res as Response, next);
            throw new Error("patchCategory should reject here");
          } catch (err) {
            expect(err).to.deep.equal(mockInternalServerError);
          }
        });
        it("should not send a response", async () => {
          try {
            await patchCategory(req, res as Response, next);
            throw new Error("patchCategory should reject here");
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
    });
    describe("if user is not authorized to update the given category...", () => {
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditCategory").resolves(false);
      });
      it("should throw a 403 error", async () => {
        try {
          await patchCategory(req, res as Response, next);
          throw new Error("patchCategory should reject here");
        } catch (err) {
          expect(err).to.deep.equal(error403);
        }
      });
      it("should not send a response", async () => {
        try {
          await patchCategory(req, res as Response, next);
          throw new Error("patchCategory should reject here");
        } catch {
        } finally {
          expect(res.statusCode).to.be.undefined;
          expect(res.body).to.be.undefined;
        }
      });
    });
  });
  describe("deleteCategory()", () => {
    beforeEach(() => {
      req = ({
        isAuth: true,
        userId: fakeUser._id,
        params: {
          id: id.toString(),
        },
      } as unknown) as AuthenticatedRequest;
    });
    describe("if user is authorized to delete the category...", () => {
      let categoryRemoveByIdStub: SinonStub;
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditCategory").resolves(true);
      });
      // TODO: Make sure category has no subcategory with transactions before deleting
      describe("if the category has no transactions...", () => {
        beforeEach(() => {
          Sinon.stub(Category, "hasTransactions").resolves(false);
        });
        describe("if the category delete is successful...", () => {
          beforeEach(() => {
            categoryRemoveByIdStub = Sinon.stub(
              Category,
              "removeById"
            ).resolves(true);
          });
          it("should delete the category", async () => {
            await deleteCategory(req, res as Response, next);
            expect(categoryRemoveByIdStub.calledOnce).to.be.true;
            expect(categoryRemoveByIdStub.calledOnceWith(id)).to.be.true;
          });
          it("should send a 200 response", async () => {
            await deleteCategory(req, res as Response, next);
            expect(res.statusCode).to.equal(200);
          });
          it("should send a success message in the response body", async () => {
            await deleteCategory(req, res as Response, next);
            expect(res.body?.message).to.equal("Category deleted successfully");
          });
        });
        describe("if the category delete is unsuccessful...", () => {
          beforeEach(() => {
            categoryRemoveByIdStub = Sinon.stub(Category, "removeById").rejects(
              mockInternalServerError
            );
          });
          it("should throw the error thrown by the delete function", async () => {
            try {
              await deleteCategory(req, res as Response, next);
              throw new Error("patchCategory should reject here");
            } catch (err) {
              expect(err).to.deep.equal(mockInternalServerError);
            }
          });
          it("should not send a response", async () => {
            try {
              await deleteCategory(req, res as Response, next);
              throw new Error("patchCategory should reject here");
            } catch {
            } finally {
              expect(res.statusCode).to.be.undefined;
              expect(res.body).to.be.undefined;
            }
          });
        });
      });
      describe("if the category has transactions...", () => {
        beforeEach(() => {
          Sinon.stub(Category, "hasTransactions").resolves(true);
        });
        it("should throw a custom 403 error", async () => {
          try {
            await deleteCategory(req, res as Response, next);
            throw new Error("patchCategory should reject here");
          } catch (err) {
            expect(err).to.deep.equal(
              new Errors.ServerError(
                403,
                "Make sure none of the current transactions are in this category before deleting it"
              )
            );
          }
        });
        it("should not send a response", async () => {
          try {
            await deleteCategory(req, res as Response, next);
            throw new Error("patchCategory should reject here");
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
    });
    describe("if user is not authorized to delete the given category...", () => {
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditCategory").resolves(false);
      });
      describe("if the category has transactions...", () => {
        beforeEach(() => {
          Sinon.stub(Category, "hasTransactions").resolves(true);
        });
        it("should throw a 403 error", async () => {
          try {
            await deleteCategory(req, res as Response, next);
            throw new Error("patchCategory should reject here");
          } catch (err) {
            expect(err).to.deep.equal(error403);
          }
        });
        it("should not send a response", async () => {
          try {
            await deleteCategory(req, res as Response, next);
            throw new Error("patchCategory should reject here");
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
      describe("if the category has no transactions...", () => {
        beforeEach(() => {
          Sinon.stub(Category, "hasTransactions").resolves(false);
        });
        it("should throw a 403 error", async () => {
          try {
            await deleteCategory(req, res as Response, next);
            throw new Error("patchCategory should reject here");
          } catch (err) {
            expect(err).to.deep.equal(error403);
          }
        });
        it("should not send a response", async () => {
          try {
            await deleteCategory(req, res as Response, next);
            throw new Error("patchCategory should reject here");
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
    });
  });
});
