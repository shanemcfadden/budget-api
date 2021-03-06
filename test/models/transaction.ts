import { expect } from "chai";
import { RowDataPacket } from "mysql2";
import sinon from "sinon";
import Transaction from "../../src/models/transaction";
import * as Model from "../../src/util/models";

describe("Transaction model", () => {
  const newTransactionData = {
    amount: 3.55,
    description: "Coffee",
    date: new Date("2020-01-15"),
    accountId: 4,
    categoryId: 2,
  };
  const mockTransactionData = {
    ...newTransactionData,
    id: 2,
  };
  const {
    id,
    amount,
    description,
    date,
    accountId,
    categoryId,
  } = mockTransactionData;
  afterEach(() => {
    sinon.restore();
  });
  describe("create()", () => {
    it("should call util create() and return its value", async () => {
      const createStub = sinon.stub(Model, "create").resolves({ _id: id });
      const results = await Transaction.create(newTransactionData);
      expect(
        createStub.calledOnceWith(
          [amount, description, date, accountId, categoryId],
          "transaction"
        )
      ).to.be.true;
      expect(results).to.deep.equal({ _id: id });
    });
  });
  describe("findById()", () => {
    it("should call util findById() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findById")
        .resolves(mockTransactionData as RowDataPacket);
      const results = await Transaction.findById(id);
      expect(findStub.calledOnceWith(id, "transaction")).to.be.true;
      expect(results).to.deep.equal(mockTransactionData);
    });
  });
  describe("findAllByBudgetId()", () => {
    const budgetId = 3321;
    it("should call util findAllByBudgetId() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findAllByBudgetId")
        .resolves([mockTransactionData as RowDataPacket]);
      const results = await Transaction.findAllByBudgetId(budgetId);
      expect(findStub.calledOnceWith(budgetId, "transaction")).to.be.true;
      expect(results).to.deep.equal([mockTransactionData]);
    });
  });
  describe("update()", () => {
    it("should call util update() and return its value", async () => {
      const updateSub = sinon.stub(Model, "update").resolves(true);
      const results = await Transaction.update(mockTransactionData);
      expect(
        updateSub.calledOnceWith(
          id,
          [amount, description, date, accountId, categoryId],
          "transaction"
        )
      ).to.be.true;
      expect(results).to.equal(true);
    });
  });
  describe("removeById()", () => {
    it("should call util removeById() and return its value", async () => {
      const removeStub = sinon.stub(Model, "removeById").resolves(true);
      const results = await Transaction.removeById(id);
      expect(removeStub.calledOnceWith(id, "transaction")).to.be.true;
      expect(results).to.deep.equal(true);
    });
  });
});
