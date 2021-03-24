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
  const mockCurrentBalance = 3000;
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
            it("should send current balance in the response body", async () => {
              await postTransaction(req, res as Response, next);
              expect(res.body?.currentBalance).to.equal(mockCurrentBalance);
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
            it("should send the transaction id in the response body", async () => {
              await postTransaction(req, res as Response, next);
              expect(res.body?.transactionId).to.equal(id);
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
    const oldTransaction = {
      id,
      description: "old description",
      amount: 503,
      date: new Date("2016-01-01"),
      subcategoryId: subcategoryId + 10,
      accountId,
    };
    let getTransactionByIdStub: SinonStub;
    beforeEach(() => {
      req = ({
        userId: fakeUser._id,
        isAuth: true,
        body: { description, amount, date, subcategoryId, accountId },
        params: {
          id: id.toString(),
        },
      } as unknown) as AuthenticatedRequest;
      getTransactionByIdStub = Sinon.stub(Transaction, "findById").resolves(
        oldTransaction
      );
    });
    describe("if user has permission to update the given transaction...", () => {
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditTransaction").resolves(true);
      });
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
              describe("if the new account is the same as the old account...", () => {
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
                it("should send updated current balance in the response body", async () => {
                  await patchTransaction(req, res as Response, next);
                  expect(res.body?.editedAccounts).to.deep.equal([
                    { accountId, currentBalance: mockCurrentBalance },
                  ]);
                });
              });
              describe("if the new account is not the same as the old account...", () => {
                const oldAccountId = 471262;
                const oldAccountCurrentBalance = 20;
                beforeEach(() => {
                  getTransactionByIdStub.resolves({
                    ...oldTransaction,
                    accountId: oldAccountId,
                  });
                  const getCurrentBalanceStub = Sinon.stub(
                    Account,
                    "getCurrentBalance"
                  );
                  getCurrentBalanceStub
                    .withArgs(accountId)
                    .resolves(mockCurrentBalance);
                  getCurrentBalanceStub
                    .withArgs(oldAccountId)
                    .resolves(oldAccountCurrentBalance);
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
                it("should send the updated current balances in the response body", async () => {
                  await patchTransaction(req, res as Response, next);
                  expect(res.body?.editedAccounts).to.deep.equal([
                    { accountId, currentBalance: mockCurrentBalance },
                    {
                      accountId: oldAccountId,
                      currentBalance: oldAccountCurrentBalance,
                    },
                  ]);
                });
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
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditTransaction").resolves(false);
      });
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
      Sinon.stub(Transaction, "findById").resolves(fakeTransaction);
    });
    describe("if user is authorized to remove given transaction...", () => {
      let transactionRemoveStub: SinonStub;
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditTransaction").resolves(true);
      });
      describe("if remove is successful...", () => {
        beforeEach(() => {
          transactionRemoveStub = Sinon.stub(
            Transaction,
            "removeById"
          ).resolves(true);
        });
        describe("if current balance of account is retrieved successfully...", () => {
          beforeEach(() => {
            Sinon.stub(Account, "getCurrentBalance").resolves(
              mockCurrentBalance
            );
          });
          it("should remove the transaction", async () => {
            await deleteTransaction(req, res as Response, next);
            expect(transactionRemoveStub.calledOnce).to.be.true;
            expect(transactionRemoveStub.calledOnceWith(id)).to.be.true;
          });
          it("should send a 200 response", async () => {
            await deleteTransaction(req, res as Response, next);
            expect(res.statusCode).to.equal(200);
          });
          it("should send a success message in the response body", async () => {
            await deleteTransaction(req, res as Response, next);
            expect(res.body?.message).to.equal(
              "Transaction removed successfully"
            );
          });
          it("should send the updated current balance of the transaction's account", async () => {
            await deleteTransaction(req, res as Response, next);
            expect(res.body?.currentBalance).to.equal(mockCurrentBalance);
          });
        });
        describe("if current balance is not retrieved successfully...", () => {
          beforeEach(() => {
            Sinon.stub(Account, "getCurrentBalance").rejects();
          });
          it("should remove the transaction", async () => {
            await deleteTransaction(req, res as Response, next);
            expect(transactionRemoveStub.calledOnce).to.be.true;
            expect(transactionRemoveStub.calledOnceWith(id)).to.be.true;
          });
          it("should send a 200 response", async () => {
            await deleteTransaction(req, res as Response, next);
            expect(res.statusCode).to.equal(200);
          });
          it("should send a success message in the response body", async () => {
            await deleteTransaction(req, res as Response, next);
            expect(res.body?.message).to.equal(
              "Transaction removed successfully"
            );
          });
          it("should send an error message in the response body", async () => {
            await deleteTransaction(req, res as Response, next);
            expect(res.body?.error.message).to.equal(
              "Internal server error: unable to retrieve current account balance"
            );
          });
        });
      });
      describe("if the remove is not successful...", () => {
        beforeEach(() => {
          transactionRemoveStub = Sinon.stub(Transaction, "removeById").rejects(
            mockInternalServerError
          );
        });
        it("should pass along error rejected by the model", async () => {
          try {
            await deleteTransaction(req, res as Response, next);
            throw new Error("deleteTransaction() should reject here");
          } catch (err) {
            expect(err).to.deep.equal(mockInternalServerError);
          }
        });
        it("should not send a response", async () => {
          try {
            await deleteTransaction(req, res as Response, next);
            throw new Error("deleteTransaction() should reject here");
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
    });
    describe("if user is not authorized to remove given transaction...", () => {
      beforeEach(() => {
        Sinon.stub(User, "hasPermissionToEditTransaction").resolves(false);
      });
      it("should pass along a 403 error", async () => {
        try {
          await deleteTransaction(req, res as Response, next);
          throw new Error("deleteTransaction() should reject here");
        } catch (err) {
          expect(err).to.deep.equal(error403);
        }
      });
      it("should not send a response", async () => {
        try {
          await deleteTransaction(req, res as Response, next);
          throw new Error("deleteTransaction() should reject here");
        } catch {
        } finally {
          expect(res.statusCode).to.be.undefined;
          expect(res.body).to.be.undefined;
        }
      });
    });
  });
});
