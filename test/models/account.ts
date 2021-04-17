import { expect } from "chai";
import { RowDataPacket } from "mysql2";
import sinon from "sinon";
import Account from "models/account";
import * as Model from "util/models";
import * as Database from "database/Database";

describe("Account model", () => {
  const newAccountData = {
    name: "The Addams Family account",
    description: "It's a bit scary...",
    startDate: new Date("2020-01-11"),
    startBalance: 100,
    budgetId: 3,
  };
  const accountData = {
    ...newAccountData,
    id: 2,
    currentBalance: 300,
  };
  const {
    id,
    name,
    description,
    startDate,
    startBalance,
    currentBalance,
    budgetId,
  } = accountData;
  const updateAccountArr = [name, description, startDate, startBalance];
  const accountDataArr = [...updateAccountArr, budgetId];
  const modelName = "account";

  afterEach(() => {
    sinon.restore();
  });

  describe("create()", () => {
    it("should call util create() and return its value", async () => {
      const createStub = sinon.stub(Model, "create").resolves({ _id: id });
      const results = await Account.create(newAccountData);
      expect(createStub.calledOnceWith(accountDataArr, modelName)).to.be.true;
      expect(results).to.deep.equal({ _id: id });
    });
  });
  describe("findById()", () => {
    it("should call util findById() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findById")
        .resolves(accountData as RowDataPacket);
      const results = await Account.findById(id);
      expect(findStub.calledOnceWith(id, modelName)).to.be.true;
      expect(results).to.deep.equal(accountData);
    });
  });
  describe("findAllByBudgetId()", () => {
    const budgetId = 3321;
    it("should call util findAllByBudgetId() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findAllByBudgetId")
        .resolves([accountData as RowDataPacket]);
      const results = await Account.findAllByBudgetId(budgetId);
      expect(findStub.calledOnceWith(budgetId, modelName)).to.be.true;
      expect(results).to.deep.equal([accountData]);
    });
  });
  describe("findAllByUserId()", () => {
    const userId = "asdfwerwqiohon";
    it("should call util findAllByUserId() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findAllByUserId")
        .resolves([accountData as RowDataPacket]);
      const results = await Account.findAllByUserId(userId);
      expect(findStub.calledOnceWith(userId, modelName)).to.be.true;
      expect(results).to.deep.equal([accountData]);
    });
  });
  describe("getCurrentBalance()", () => {
    it("should query database and return results of its only value", async () => {
      const queryDbStub = sinon
        .stub(Database, "queryDb")
        .resolves([{ currentBalance } as RowDataPacket]);
      const result = await Account.getCurrentBalance(id);
      expect(queryDbStub.calledOnce).to.be.true;
      expect(queryDbStub.calledOnceWith("accounts/getCurrentBalance.sql", [id]))
        .to.be.true;
      expect(result).to.equal(currentBalance);
    });
  });
  describe("update()", () => {
    it("should call util update() and return its value", async () => {
      const updateSub = sinon.stub(Model, "update").resolves(true);
      const results = await Account.update(accountData);
      expect(updateSub.calledOnceWith(id, updateAccountArr, modelName)).to.be
        .true;
      expect(results).to.equal(true);
    });
  });
  describe("removeById()", () => {
    it("should call util removeById() and return its value", async () => {
      const removeStub = sinon.stub(Model, "removeById").resolves(true);
      const results = await Account.removeById(id);
      expect(removeStub.calledOnceWith(id, modelName)).to.be.true;
      expect(results).to.deep.equal(true);
    });
  });
});
