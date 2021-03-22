import { NextFunction, Response } from "express";
import Sinon, { SinonStub } from "sinon";
import { AuthenticatedRequest } from "../../src/types/express";
import { TransactionControllerBase } from "../../src/controllers/transaction";
import {
  fakeTransactions,
  fakeUser,
  mockInternalServerError,
} from "../fixtures";
import * as Errors from "../../src/util/errors";
import { MockResponse } from "../types";
import User from "../../src/models/user";
import Transaction from "../../src/models/transaction";
import { expect } from "chai";
import Account from "../../src/models/account";

const {
  postTransaction,
  patchTransaction,
  deleteTransaction,
} = TransactionControllerBase;

describe("TransactionController", () => {
  const fakeTransaction = fakeTransactions[0];
  const {
    id,
    description,
    amount,
    date,
    subcategoryId,
    accountId,
  } = fakeTransaction;
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
  describe("postTransaction()", () => {
    beforeEach(() => {
      req = {
        userId: fakeUser._id,
        isAuth: true,
        body: {
          description,
          amount,
          date,
          subcategoryId,
          accountId,
        },
      } as AuthenticatedRequest;
    });
    describe("if user has permission to update given account...", () => {
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditAccount").resolves(true);
      });
      describe("if user has permission to update given subcategory...", () => {
        let createTransactionStub: SinonStub;
        beforeEach(() => {
          Sinon.stub(User, "hasPermissionToEditSubcategory").resolves(true);
        });
        describe("if transaction creation was successful...", () => {
          beforeEach(() => {
            createTransactionStub = Sinon.stub(Transaction, "create").resolves({
              _id: id,
            });
          });
          describe("if retrieving new current balance for the given account is successful...", () => {
            const mockCurrentBalance = 3000;
            beforeEach(() => {
              Sinon.stub(Account, "getCurrentBalance").resolves(
                mockCurrentBalance
              );
            });
            it("should create the transaction", async () => {
              await postTransaction(req, res as Response, next);
              expect(createTransactionStub.calledOnce).to.be.true;
              expect(
                createTransactionStub.calledOnceWith({
                  amount,
                  description,
                  date,
                  accountId,
                  subcategoryId,
                })
              ).to.be.true;
            });
            it("should send a 200 response", async () => {
              await postTransaction(req, res as Response, next);
              expect(res.statusCode).to.equal(200);
            });
            it("should send a success message in the response body", async () => {
              await postTransaction(req, res as Response, next);
              expect(res.body?.message).to.equal(
                "Transaction created successfully"
              );
            });
            it("should send the transaction id in the response body", async () => {
              await postTransaction(req, res as Response, next);
              expect(res.body?.transactionId).to.equal(id);
            });
          });
          describe("if retrieving the new current balance for the given account is not successful...", () => {
            beforeEach(() => {
              Sinon.stub(Account, "getCurrentBalance").rejects(
                mockInternalServerError
              );
            });
            it("should create the transaction", async () => {
              await postTransaction(req, res as Response, next);
              expect(createTransactionStub.calledOnce).to.be.true;
              expect(
                createTransactionStub.calledOnceWith({
                  amount,
                  description,
                  date,
                  accountId,
                  subcategoryId,
                })
              ).to.be.true;
            });
            it("should send a 200 response", async () => {
              await postTransaction(req, res as Response, next);
              expect(res.statusCode).to.equal(200);
            });

            it("should send a partial success message in the response body", async () => {
              await postTransaction(req, res as Response, next);
              expect(res.body?.message).to.equal(
                "Transaction created successfully"
              );
            });
            it("should send a server error message in the response body", async () => {
              await postTransaction(req, res as Response, next);
              expect(res.body?.error.message).to.equal(
                "Internal server error: unable to retrieve current account balance"
              );
            });
          });
        });
        describe("if transaction creation was not successful...", () => {
          beforeEach(() => {
            Sinon.stub(Transaction, "create").rejects(mockInternalServerError);
          });
          it("should pass along the error rejected by the model function", async () => {
            try {
              await postTransaction(req, res as Response, next);
              throw new Error("postTransaction should reject here");
            } catch (err) {
              expect(err).to.deep.equal(mockInternalServerError);
            }
          });
          it("should not send a response", async () => {
            try {
              await postTransaction(req, res as Response, next);
            } catch {
            } finally {
              expect(res.statusCode).to.be.undefined;
              expect(res.body).to.be.undefined;
            }
          });
        });
      });
      describe("if user does not have permission to update given subcategory...", () => {
        beforeEach(() => {
          Sinon.stub(User, "hasPermissionToEditSubcategory").resolves(false);
        });
        it("should throw a 403 error", async () => {
          try {
            await postTransaction(req, res as Response, next);
            throw new Error("postTransaction should reject here");
          } catch (err) {
            expect(err).to.deep.equal(error403);
          }
        });
        it("should not send a response", async () => {
          try {
            await postTransaction(req, res as Response, next);
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
    });
    describe("if user does not have permission to update given account...", () => {
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditAccount").resolves(false);
      });
      describe("if user has permission to update given subcategory...", () => {
        beforeEach(() => {
          Sinon.stub(User, "hasPermissionToEditSubcategory").resolves(true);
        });
        it("should throw a 403 error", async () => {
          try {
            await postTransaction(req, res as Response, next);
            throw new Error("postTransaction should reject here");
          } catch (err) {
            expect(err).to.deep.equal(error403);
          }
        });
        it("should not send a response", async () => {
          try {
            await postTransaction(req, res as Response, next);
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
      describe("if user does not have permission to update given subcategory...", () => {
        beforeEach(() => {
          Sinon.stub(User, "hasPermissionToEditSubcategory").resolves(false);
        });
        it("should throw a 403 error", async () => {
          try {
            await postTransaction(req, res as Response, next);
            throw new Error("postTransaction should reject here");
          } catch (err) {
            expect(err).to.deep.equal(error403);
          }
        });
        it("should not send a response", async () => {
          try {
            await postTransaction(req, res as Response, next);
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
    });
  });
  describe("patchTransaction()", () => {
    beforeEach(() => {
      req = ({
        userId: fakeUser._id,
        isAuth: true,
        body: { description, amount, date, subcategoryId, accountId },
        params: {
          id: id.toString(),
        },
      } as unknown) as AuthenticatedRequest;
    });
    describe("if user has permission to update the given transaction...", () => {
      describe("if user has permission to update given account...", () => {
        beforeEach(() => {
          Sinon.stub(User, "hasPermissionToEditAccount").resolves(true);
        });
        describe("if user has permission to update given subcategory...", () => {
          let updateTransactonStub: SinonStub;
          beforeEach(() => {
            Sinon.stub(User, "hasPermissionToEditSubcategory").resolves(true);
          });
          describe("if transaction update was successful...", () => {
            beforeEach(() => {
              updateTransactonStub = Sinon.stub(Transaction, "update").resolves(
                true
              );
            });
            describe("if retrieving new current balance for the given account is successful...", () => {
              const mockCurrentBalance = 3000;
              beforeEach(() => {
                Sinon.stub(Account, "getCurrentBalance").resolves(
                  mockCurrentBalance
                );
              });
              it("should update the transaction", async () => {
                await patchTransaction(req, res as Response, next);
                expect(updateTransactonStub.calledOnce).to.be.true;
                expect(
                  updateTransactonStub.calledOnceWith({
                    id,
                    amount,
                    description,
                    date,
                    accountId,
                    subcategoryId,
                  })
                ).to.be.true;
              });
              it("should send a 200 response", async () => {
                await patchTransaction(req, res as Response, next);
                expect(res.statusCode).to.equal(200);
              });
              it("should send a success message in the response body", async () => {
                await patchTransaction(req, res as Response, next);
                expect(res.body?.message).to.equal(
                  "Transaction updated successfully"
                );
              });
              it("should send the transaction id in the response body", async () => {
                await patchTransaction(req, res as Response, next);
                expect(res.body?.transactionId).to.equal(id);
              });
            });
            describe("if retrieving the new current balance for the given account is not successful...", () => {
              beforeEach(() => {
                Sinon.stub(Account, "getCurrentBalance").rejects(
                  mockInternalServerError
                );
              });
              it("should update the transaction", async () => {
                await patchTransaction(req, res as Response, next);
                expect(updateTransactonStub.calledOnce).to.be.true;
                expect(
                  updateTransactonStub.calledOnceWith({
                    id,
                    amount,
                    description,
                    date,
                    accountId,
                    subcategoryId,
                  })
                ).to.be.true;
              });
              it("should send a 200 response", async () => {
                await patchTransaction(req, res as Response, next);
                expect(res.statusCode).to.equal(200);
              });

              it("should send a partial success message in the response body", async () => {
                await patchTransaction(req, res as Response, next);
                expect(res.body?.message).to.equal(
                  "Transaction updated successfully"
                );
              });
              it("should send a server error message in the response body", async () => {
                await patchTransaction(req, res as Response, next);
                expect(res.body?.error.message).to.equal(
                  "Internal server error: unable to retrieve current account balance"
                );
              });
            });
          });
          describe("if transaction update was not successful...", () => {
            beforeEach(() => {
              Sinon.stub(Transaction, "update").rejects(
                mockInternalServerError
              );
            });
            it("should pass along the error rejected by the model function", async () => {
              try {
                await patchTransaction(req, res as Response, next);
                throw new Error("patchTransaction should reject here");
              } catch (err) {
                expect(err).to.deep.equal(mockInternalServerError);
              }
            });
            it("should not send a response", async () => {
              try {
                await patchTransaction(req, res as Response, next);
              } catch {
              } finally {
                expect(res.statusCode).to.be.undefined;
                expect(res.body).to.be.undefined;
              }
            });
          });
        });
        describe("if user does not have permission to update given subcategory...", () => {
          beforeEach(() => {
            Sinon.stub(User, "hasPermissionToEditSubcategory").resolves(false);
          });
          it("should throw a 403 error", async () => {
            try {
              await patchTransaction(req, res as Response, next);
              throw new Error("patchTransaction should reject here");
            } catch (err) {
              expect(err).to.deep.equal(error403);
            }
          });
          it("should not send a response", async () => {
            try {
              await patchTransaction(req, res as Response, next);
            } catch {
            } finally {
              expect(res.statusCode).to.be.undefined;
              expect(res.body).to.be.undefined;
            }
          });
        });
      });
      describe("if user does not have permission to update given account...", () => {
        beforeEach(() => {
          Sinon.stub(User, "hasPermissionToEditAccount").resolves(false);
        });
        describe("if user has permission to update given subcategory...", () => {
          beforeEach(() => {
            Sinon.stub(User, "hasPermissionToEditSubcategory").resolves(true);
          });
          it("should throw a 403 error", async () => {
            try {
              await patchTransaction(req, res as Response, next);
              throw new Error("patchTransaction should reject here");
            } catch (err) {
              expect(err).to.deep.equal(error403);
            }
          });
          it("should not send a response", async () => {
            try {
              await patchTransaction(req, res as Response, next);
            } catch {
            } finally {
              expect(res.statusCode).to.be.undefined;
              expect(res.body).to.be.undefined;
            }
          });
        });
        describe("if user does not have permission to update given subcategory...", () => {
          beforeEach(() => {
            Sinon.stub(User, "hasPermissionToEditSubcategory").resolves(false);
          });
          it("should throw a 403 error", async () => {
            try {
              await patchTransaction(req, res as Response, next);
              throw new Error("patchTransaction should reject here");
            } catch (err) {
              expect(err).to.deep.equal(error403);
            }
          });
          it("should not send a response", async () => {
            try {
              await patchTransaction(req, res as Response, next);
            } catch {
            } finally {
              expect(res.statusCode).to.be.undefined;
              expect(res.body).to.be.undefined;
            }
          });
        });
      });
    });
    describe("if user does not have permission to edit given transaction...", () => {
      describe("if user has permission to update given account...", () => {
        beforeEach(() => {
          Sinon.stub(User, "hasPermissionToEditAccount").resolves(true);
        });
        describe("if user has permission to update given subcategory...", () => {
          beforeEach(() => {
            Sinon.stub(User, "hasPermissionToEditSubcategory").resolves(true);
          });
          it("should throw a 403 error", async () => {
            try {
              await patchTransaction(req, res as Response, next);
              throw new Error("patchTransaction should reject here");
            } catch (err) {
              expect(err).to.deep.equal(error403);
            }
          });
          it("should not send a response", async () => {
            try {
              await patchTransaction(req, res as Response, next);
            } catch {
            } finally {
              expect(res.statusCode).to.be.undefined;
              expect(res.body).to.be.undefined;
            }
          });
        });
        describe("if user does not have permission to update given subcategory...", () => {
          beforeEach(() => {
            Sinon.stub(User, "hasPermissionToEditSubcategory").resolves(false);
          });
          it("should throw a 403 error", async () => {
            try {
              await patchTransaction(req, res as Response, next);
              throw new Error("patchTransaction should reject here");
            } catch (err) {
              expect(err).to.deep.equal(error403);
            }
          });
          it("should not send a response", async () => {
            try {
              await patchTransaction(req, res as Response, next);
            } catch {
            } finally {
              expect(res.statusCode).to.be.undefined;
              expect(res.body).to.be.undefined;
            }
          });
        });
      });

      describe("if user does not have permission to update given account...", () => {
        beforeEach(() => {
          Sinon.stub(User, "hasPermissionToEditAccount").resolves(false);
        });
        describe("if user has permission to update given subcategory...", () => {
          beforeEach(() => {
            Sinon.stub(User, "hasPermissionToEditSubcategory").resolves(true);
          });
          it("should throw a 403 error", async () => {
            try {
              await patchTransaction(req, res as Response, next);
              throw new Error("patchTransaction should reject here");
            } catch (err) {
              expect(err).to.deep.equal(error403);
            }
          });
          it("should not send a response", async () => {
            try {
              await patchTransaction(req, res as Response, next);
            } catch {
            } finally {
              expect(res.statusCode).to.be.undefined;
              expect(res.body).to.be.undefined;
            }
          });
        });
        describe("if user does not have permission to update given subcategory...", () => {
          beforeEach(() => {
            Sinon.stub(User, "hasPermissionToEditSubcategory").resolves(false);
          });
          it("should throw a 403 error", async () => {
            try {
              await patchTransaction(req, res as Response, next);
              throw new Error("patchTransaction should reject here");
            } catch (err) {
              expect(err).to.deep.equal(error403);
            }
          });
          it("should not send a response", async () => {
            try {
              await patchTransaction(req, res as Response, next);
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
  describe("deleteTransaction()", () => {
    beforeEach(() => {
      req = ({
        userId: fakeUser._id,
        isAuth: true,
        params: {
          id: id.toString(),
        },
      } as unknown) as AuthenticatedRequest;
    });
  });
});
