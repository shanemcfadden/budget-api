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
