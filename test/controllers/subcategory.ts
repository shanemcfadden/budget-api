import { NextFunction, Response } from "express";
import Sinon, { SinonStub } from "sinon";
import { AuthenticatedRequest } from "../../src/types/express";
import { SubcategoryControllerBase } from "../../src/controllers/subcategory";
import {
  fakeSubcategories,
  fakeUser,
  mockInternalServerError,
} from "../fixtures";
import * as Errors from "../../src/util/errors";
import { MockResponse } from "../types";
import User from "../../src/models/user";
import Subcategory from "../../src/models/subcategory";
import { expect } from "chai";

const {
  postSubcategory,
  patchSubcategory,
  deleteSubcategory,
} = SubcategoryControllerBase;

describe("SubcategoryController", () => {
  const fakeSubcategory = fakeSubcategories[0];
  const { id, categoryId, description } = fakeSubcategory;
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
  describe("postSubcategory()", () => {
    beforeEach(() => {
      req = {
        userId: fakeUser._id,
        isAuth: true,
        body: {
          description,
          categoryId,
        },
      } as AuthenticatedRequest;
      describe("if user is authorized to edit given category...", () => {
        let subcategoryCreateStub: SinonStub;
        beforeEach(() => {
          Sinon.stub(User, "hasPermissionToEditCategory").resolves(true);
        });
        describe("if subcategory creation is successful...", () => {
          beforeEach(() => {
            subcategoryCreateStub = Sinon.stub(Subcategory, "create").resolves({
              _id: id,
            });
          });

          it("should create the subcategory", async () => {
            await postSubcategory(req, res as Response, next);
            expect(subcategoryCreateStub.calledOnce).to.be.true;
            expect(
              subcategoryCreateStub.calledOnceWith({ description, categoryId })
            ).to.be.true;
          });
          it("should send a 200 response", async () => {
            await postSubcategory(req, res as Response, next);
            expect(res.statusCode).to.equal(200);
          });
          it("should send a success message in the response body", async () => {
            await postSubcategory(req, res as Response, next);
            expect(res.body?.message).to.equal(
              "Subcategory successfully created"
            );
          });
          it("should send the subcategory id in the response body", async () => {
            await postSubcategory(req, res as Response, next);
            expect(res.body?.subcategoryId).to.equal(id);
          });
        });
        describe("if the subcategory creation is not successful", () => {
          beforeEach(() => {
            subcategoryCreateStub = Sinon.stub(Subcategory, "create").rejects(
              mockInternalServerError
            );
          });
          it("should pass along the error rejected by the model function", async () => {
            try {
              await postSubcategory(req, res as Response, next);
              throw new Error("postSubcategory() should throw here");
            } catch (err) {
              expect(err).to.deep.equal(mockInternalServerError);
            }
          });
          it("should not send a response", async () => {
            try {
              await postSubcategory(req, res as Response, next);
              throw new Error("postSubcategory() should throw here");
            } catch {
            } finally {
              expect(res.statusCode).to.be.undefined;
              expect(res.body).to.be.undefined;
            }
          });
        });
      });
      describe("if user is not authorized to edit given category...", () => {
        beforeEach(() => {
          Sinon.stub(User, "hasPermissionToEditCategory").resolves(false);
        });
        it("should throw a 403 error", async () => {
          try {
            await postSubcategory(req, res as Response, next);
            throw new Error("postSubcategory() should throw here");
          } catch (err) {
            expect(err).to.deep.equal(error403);
          }
        });
        it("should not send a response", async () => {
          try {
            await postSubcategory(req, res as Response, next);
            throw new Error("postSubcategory() should throw here");
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
    });
  });
  // describe('patchSubcategory()')
  // describe('deleteSubcategory()')
});
