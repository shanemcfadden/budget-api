import { NextFunction, Response } from "express";
import Sinon, { SinonStub } from "sinon";
import { AuthenticatedRequest } from "types/express";
import { SubcategoryControllerBase } from "controllers/subcategory";
import {
  fakeSubcategories,
  fakeUser,
  mockInternalServerError,
} from "../fixtures";
import * as Errors from "util/errors";
import { MockResponse } from "../types";
import User from "models/user";
import Subcategory from "models/subcategory";
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
    });
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
            "Subcategory created successfully"
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
  describe("patchSubcategory()", () => {
    beforeEach(() => {
      req = ({
        userId: fakeUser._id,
        isAuth: true,
        body: {
          description,
          categoryId,
        },
        params: {
          id: id.toString(),
        },
      } as unknown) as AuthenticatedRequest;
    });
    describe("if user is authorized to update given subcategory...", () => {
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditSubcategory").resolves(true);
      });
      describe("if user is authorized to update given category...", () => {
        let subcategoryUpdateStub: SinonStub;
        beforeEach(() => {
          Sinon.stub(User, "hasPermissionToEditCategory").resolves(true);
        });
        describe("if update is successful...", () => {
          beforeEach(() => {
            subcategoryUpdateStub = Sinon.stub(Subcategory, "update").resolves(
              true
            );
          });
          it("should update the subcategory", async () => {
            await patchSubcategory(req, res as Response, next);
            expect(subcategoryUpdateStub.calledOnce).to.be.true;
            expect(
              subcategoryUpdateStub.calledOnceWith({
                description,
                categoryId,
                id,
              })
            ).to.be.true;
          });
          it("should send a 200 response", async () => {
            await patchSubcategory(req, res as Response, next);
            expect(res.statusCode).to.equal(200);
          });
          it("should send a success message in the response body", async () => {
            await patchSubcategory(req, res as Response, next);
            expect(res.body?.message).to.equal(
              "Subcategory updated successfully"
            );
          });
        });
        describe("if the update is not successful...", () => {
          beforeEach(() => {
            subcategoryUpdateStub = Sinon.stub(Subcategory, "update").rejects(
              mockInternalServerError
            );
          });
          it("should pass along error rejected by the model", async () => {
            try {
              await patchSubcategory(req, res as Response, next);
              throw new Error("patchSubcategory() should reject here");
            } catch (err) {
              expect(err).to.deep.equal(mockInternalServerError);
            }
          });
          it("should not send a response", async () => {
            try {
              await patchSubcategory(req, res as Response, next);
              throw new Error("patchSubcategory() should reject here");
            } catch {
            } finally {
              expect(res.statusCode).to.be.undefined;
              expect(res.body).to.be.undefined;
            }
          });
        });
      });
      describe("if user is not authorized to update given category...", () => {
        beforeEach(() => {
          Sinon.stub(User, "hasPermissionToEditCategory").resolves(false);
        });
        it("should pass along a 403 error", async () => {
          try {
            await patchSubcategory(req, res as Response, next);
            throw new Error("patchSubcategory() should reject here");
          } catch (err) {
            expect(err).to.deep.equal(error403);
          }
        });
        it("should not send a response", async () => {
          try {
            await patchSubcategory(req, res as Response, next);
            throw new Error("patchSubcategory() should reject here");
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
    });
    describe("if user is not authorized to update given subcategory...", () => {
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditSubcategory").resolves(false);
      });
      describe("if user is authorized to update given category...", () => {
        beforeEach(() => {
          Sinon.stub(User, "hasPermissionToEditCategory").resolves(true);
        });
        it("should pass along a 403 error", async () => {
          try {
            await patchSubcategory(req, res as Response, next);
            throw new Error("patchSubcategory() should reject here");
          } catch (err) {
            expect(err).to.deep.equal(error403);
          }
        });
        it("should not send a response", async () => {
          try {
            await patchSubcategory(req, res as Response, next);
            throw new Error("patchSubcategory() should reject here");
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
      describe("if user is not authorized to update given category...", () => {
        beforeEach(() => {
          Sinon.stub(User, "hasPermissionToEditCategory").resolves(false);
        });
        it("should pass along a 403 error", async () => {
          try {
            await patchSubcategory(req, res as Response, next);
            throw new Error("patchSubcategory() should reject here");
          } catch (err) {
            expect(err).to.deep.equal(error403);
          }
        });
        it("should not send a response", async () => {
          try {
            await patchSubcategory(req, res as Response, next);
            throw new Error("patchSubcategory() should reject here");
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
    });
  });
  describe("deleteSubcategory()", () => {
    beforeEach(() => {
      req = ({
        userId: fakeUser._id,
        isAuth: true,
        params: {
          id: id.toString(),
        },
      } as unknown) as AuthenticatedRequest;
    });
    describe("if user is authorized to remove given subcategory...", () => {
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditSubcategory").resolves(true);
      });
      describe("if subcategory has no transactions...", () => {
        let subcategoryRemoveStub: SinonStub;
        beforeEach(() => {
          Sinon.stub(Subcategory, "hasTransactions").resolves(false);
        });
        describe("if remove is successful...", () => {
          beforeEach(() => {
            subcategoryRemoveStub = Sinon.stub(
              Subcategory,
              "removeById"
            ).resolves(true);
          });
          it("should remove the subcategory", async () => {
            await deleteSubcategory(req, res as Response, next);
            expect(subcategoryRemoveStub.calledOnce).to.be.true;
            expect(subcategoryRemoveStub.calledOnceWith(id)).to.be.true;
          });
          it("should send a 200 response", async () => {
            await deleteSubcategory(req, res as Response, next);
            expect(res.statusCode).to.equal(200);
          });
          it("should send a success message in the response body", async () => {
            await deleteSubcategory(req, res as Response, next);
            expect(res.body?.message).to.equal(
              "Subcategory removed successfully"
            );
          });
        });
        describe("if the remove is not successful...", () => {
          beforeEach(() => {
            subcategoryRemoveStub = Sinon.stub(
              Subcategory,
              "removeById"
            ).rejects(mockInternalServerError);
          });
          it("should pass along error rejected by the model", async () => {
            try {
              await deleteSubcategory(req, res as Response, next);
              throw new Error("deleteSubcategory() should reject here");
            } catch (err) {
              expect(err).to.deep.equal(mockInternalServerError);
            }
          });
          it("should not send a response", async () => {
            try {
              await deleteSubcategory(req, res as Response, next);
              throw new Error("deleteSubcategory() should reject here");
            } catch {
            } finally {
              expect(res.statusCode).to.be.undefined;
              expect(res.body).to.be.undefined;
            }
          });
        });
      });
      describe("if subcategory has transactions...", () => {
        beforeEach(() => {
          Sinon.stub(Subcategory, "hasTransactions").resolves(true);
        });
        it("should pass along a custom 403 error", async () => {
          try {
            await deleteSubcategory(req, res as Response, next);
            throw new Error("deleteSubcategory() should reject here");
          } catch (err) {
            expect(err).to.deep.equal(
              new Errors.ServerError(
                403,
                "Make sure none of the current transactions are in this subcategory before deleting it"
              )
            );
          }
        });
        it("should not send a response", async () => {
          try {
            await deleteSubcategory(req, res as Response, next);
            throw new Error("deleteSubcategory() should reject here");
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
    });
    describe("if user is not authorized to remove given subcategory...", () => {
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditSubcategory").resolves(false);
      });
      describe("if subcategory has no transactions...", () => {
        beforeEach(() => {
          Sinon.stub(Subcategory, "hasTransactions").resolves(false);
        });
        it("should pass along a 403 error", async () => {
          try {
            await deleteSubcategory(req, res as Response, next);
            throw new Error("deleteSubcategory() should reject here");
          } catch (err) {
            expect(err).to.deep.equal(error403);
          }
        });
        it("should not send a response", async () => {
          try {
            await deleteSubcategory(req, res as Response, next);
            throw new Error("deleteSubcategory() should reject here");
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
      describe("if subcategory has transactions...", () => {
        beforeEach(() => {
          Sinon.stub(Subcategory, "hasTransactions").resolves(true);
        });
        it("should pass along a 403 error", async () => {
          try {
            await deleteSubcategory(req, res as Response, next);
            throw new Error("deleteSubcategory() should reject here");
          } catch (err) {
            expect(err).to.deep.equal(error403);
          }
        });
        it("should not send a response", async () => {
          try {
            await deleteSubcategory(req, res as Response, next);
            throw new Error("deleteSubcategory() should reject here");
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
