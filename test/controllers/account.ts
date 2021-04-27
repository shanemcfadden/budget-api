import { NextFunction, Response } from "express";
import Sinon, { SinonStub } from "sinon";
import { AccountControllerBase } from "controllers/account";
import Account from "models/account";
import User from "models/user";
import { AuthenticatedRequest } from "types/express";
import { MockResponse } from "../types";
import { fakeAccounts, fakeUser, mockInternalServerError } from "../fixtures";
import { expect } from "chai";
import * as Errors from "util/errors";

const { postAccount, patchAccount, deleteAccount } = AccountControllerBase;

describe("AccountController", () => {
  const fakeAccount = fakeAccounts[0];
  const error403 = new Errors.ServerError(403, "Access denied");
  const {
    id,
    name,
    description,
    startBalance,
    startDate,
    budgetId,
  } = fakeAccount;
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
  describe("postAccount()", () => {
    beforeEach(() => {
      req = {
        userId: fakeUser._id,
        isAuth: true,
        body: {
          name,
          description,
          startBalance,
          startDate: startDate.toString(),
          budgetId,
        },
      } as AuthenticatedRequest;
    });
    describe("if user is authorized to add an account to the given budget...", () => {
      let createAccountStub: SinonStub;
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditBudget").resolves(true);
      });
      describe("if the account creation is successful...", () => {
        beforeEach(() => {
          createAccountStub = Sinon.stub(Account, "create").resolves({
            _id: id,
          });
        });
        it("should create the account", async () => {
          await postAccount(req, res as Response, next);
          expect(createAccountStub.calledOnce).to.be.true;
          expect(
            createAccountStub.calledWith({
              name,
              description,
              startDate,
              startBalance,
              budgetId,
            })
          ).to.be.true;
        });
        it("should send a 200 response", async () => {
          await postAccount(req, res as Response, next);
          expect(res.statusCode).to.exist;
          expect(res.statusCode).to.equal(200);
        });
        it("should have a success message in the response body", async () => {
          await postAccount(req, res as Response, next);
          expect(res.body?.message).to.equal("Account created successfully");
        });
        it("should have the new account id in the response body", async () => {
          await postAccount(req, res as Response, next);
          expect(res.body?.accountId).to.equal(id);
        });
      });
      describe("if the account creation results in an error", () => {
        beforeEach(() => {
          createAccountStub = Sinon.stub(Account, "create").rejects(
            mockInternalServerError
          );
        });
        it("should throw said error", async () => {
          try {
            await postAccount(req, res as Response, next);
            throw new Error("postAccount should throw here");
          } catch (err) {
            expect(err).to.deep.equal(mockInternalServerError);
          }
        });
        it("should not send a response", async () => {
          try {
            await postAccount(req, res as Response, next);
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
    });
    describe("if user is not authorized to add an account to the given budget...", () => {
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditBudget").resolves(false);
      });
      it("should throw a 403 error", async () => {
        try {
          await postAccount(req, res as Response, next);
          throw new Error("postAccount should throw here");
        } catch (err) {
          expect(err).to.deep.equal(error403);
        }
      });
      it("should not send a response", async () => {
        try {
          await postAccount(req, res as Response, next);
        } catch {
        } finally {
          expect(res.statusCode).to.be.undefined;
          expect(res.body).to.be.undefined;
        }
      });
    });
  });
  describe("patchAccount()", () => {
    beforeEach(() => {
      req = ({
        userId: fakeUser._id,
        isAuth: true,
        body: {
          name,
          description,
          startBalance,
          startDate: startDate.toString(),
        },
        params: {
          id,
        },
      } as unknown) as AuthenticatedRequest;
    });
    describe("if user is authorized to update said account", () => {
      let updateAccountStub: SinonStub;
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditAccount").resolves(true);
      });
      describe("if the account update is successful...", () => {
        beforeEach(() => {
          updateAccountStub = Sinon.stub(Account, "update").resolves(true);
        });
        it("should update the account", async () => {
          await patchAccount(req, res as Response, next);
          expect(updateAccountStub.calledOnce).to.be.true;
          expect(
            updateAccountStub.calledWith({
              id,
              name,
              description,
              startDate,
              startBalance,
            })
          ).to.be.true;
        });
        it("should send a 200 response", async () => {
          await patchAccount(req, res as Response, next);
          expect(res.statusCode).to.exist;
          expect(res.statusCode).to.equal(200);
        });
        it("should have a success message in the response body", async () => {
          await patchAccount(req, res as Response, next);
          expect(res.body?.message).to.equal("Account updated successfully");
        });
      });
      describe("if the account creation results in an error", () => {
        beforeEach(() => {
          updateAccountStub = Sinon.stub(Account, "update").rejects(
            mockInternalServerError
          );
        });
        it("should throw said error", async () => {
          try {
            await patchAccount(req, res as Response, next);
            throw new Error("patchAccount should throw here");
          } catch (err) {
            expect(err).to.deep.equal(mockInternalServerError);
          }
        });
        it("should not send a response", async () => {
          try {
            await patchAccount(req, res as Response, next);
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
    });
  });
  describe("deleteAccount()", () => {
    beforeEach(() => {
      req = ({
        userId: fakeUser._id,
        isAuth: true,
        params: {
          id,
        },
      } as unknown) as AuthenticatedRequest;
    });
    describe("if user is authorized to remove given account...", () => {
      let deleteAccountStub: SinonStub;
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditAccount").resolves(true);
      });
      describe("if the account creation is successful...", () => {
        beforeEach(() => {
          deleteAccountStub = Sinon.stub(Account, "removeById").resolves(true);
        });
        it("should delete the account", async () => {
          await deleteAccount(req, res as Response, next);
          expect(deleteAccountStub.calledOnce).to.be.true;
          expect(deleteAccountStub.calledWith(id)).to.be.true;
        });
        it("should send a 200 response", async () => {
          await deleteAccount(req, res as Response, next);
          expect(res.statusCode).to.exist;
          expect(res.statusCode).to.equal(200);
        });
        it("should have a success message in the response body", async () => {
          await deleteAccount(req, res as Response, next);
          expect(res.body?.message).to.equal("Account deleted successfully");
        });
      });
      describe("if the account deletion results in an error", () => {
        beforeEach(() => {
          deleteAccountStub = Sinon.stub(Account, "removeById").rejects(
            mockInternalServerError
          );
        });
        it("should throw said error", async () => {
          try {
            await deleteAccount(req, res as Response, next);
            throw new Error("deleteAccount should throw here");
          } catch (err) {
            expect(err).to.deep.equal(mockInternalServerError);
          }
        });
        it("should not send a response", async () => {
          try {
            await deleteAccount(req, res as Response, next);
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
    });
    describe("if user is not authorized to remove a given account...", () => {
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditAccount").resolves(false);
      });
      it("should throw a 403 error", async () => {
        try {
          await deleteAccount(req, res as Response, next);
          throw new Error("deleteAccount should throw here");
        } catch (err) {
          expect(err).to.deep.equal(error403);
        }
      });
      it("should not send a response", async () => {
        try {
          await deleteAccount(req, res as Response, next);
        } catch {
        } finally {
          expect(res.statusCode).to.be.undefined;
          expect(res.body).to.be.undefined;
        }
      });
    });
  });
});
