import { expect } from "chai";
import { RowDataPacket } from "mysql2";
import sinon from "sinon";
import Transaction from "../../src/models/transaction";
import * as Model from "../../src/util/models";
import { fakeTransactions } from "../fixtures";

describe("Transaction model", () => {
  const transactionData = fakeTransactions[0];
  const {
    id,
    amount,
    description,
    date,
    accountId,
    categoryId,
  } = transactionData;
  const newTransactionData = {
    amount,
    description,
    date,
    accountId,
    categoryId,
  };
  const transactionDataArr = [amount, description, date, accountId, categoryId];
  const modelName = "transaction";

  afterEach(() => {
    sinon.restore();
  });
  describe("create()", () => {
    it("should call util create() and return its value", async () => {
      const createStub = sinon.stub(Model, "create").resolves({ _id: id });
      const results = await Transaction.create(newTransactionData);
      expect(createStub.calledOnceWith(transactionDataArr, modelName)).to.be
        .true;
      expect(results).to.deep.equal({ _id: id });
    });
  });
  describe("findById()", () => {
    it("should call util findById() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findById")
        .resolves(transactionData as RowDataPacket);
      const results = await Transaction.findById(id);
      expect(findStub.calledOnceWith(id, modelName)).to.be.true;
      expect(results).to.deep.equal(transactionData);
    });
  });
  describe("findAllByBudgetId()", () => {
    const budgetId = 3321;
    it("should call util findAllByBudgetId() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findAllByBudgetId")
        .resolves([transactionData as RowDataPacket]);
      const results = await Transaction.findAllByBudgetId(budgetId);
      expect(findStub.calledOnceWith(budgetId, modelName)).to.be.true;
      expect(results).to.deep.equal([transactionData]);
    });
  });
  describe("update()", () => {
    it("should call util update() and return its value", async () => {
      const updateSub = sinon.stub(Model, "update").resolves(true);
      const results = await Transaction.update(transactionData);
      expect(updateSub.calledOnceWith(id, transactionDataArr, modelName)).to.be
        .true;
      expect(results).to.equal(true);
    });
  });
  describe("removeById()", () => {
    it("should call util removeById() and return its value", async () => {
      const removeStub = sinon.stub(Model, "removeById").resolves(true);
      const results = await Transaction.removeById(id);
      expect(removeStub.calledOnceWith(id, modelName)).to.be.true;
      expect(results).to.deep.equal(true);
    });
  });
});
