import { expect } from "chai";
import { RowDataPacket } from "mysql2";
import sinon, { SinonStub } from "sinon";
import * as Database from "../../src/database/Database";
import Account from "../../src/models/account";
import * as Model from "../../src/util/models";

describe("Account model", () => {
  let queryDbStub: SinonStub;
  const newAccountData = {
    name: "The Addams Family account",
    description: "It's a bit scary...",
    startDate: new Date("2020-01-11"),
    startBalance: 100,
    budgetId: 3,
  };
  const mockAccountData = {
    ...newAccountData,
    id: 2,
  };
  const {
    id,
    name,
    description,
    startDate,
    startBalance,
    budgetId,
  } = mockAccountData;
  afterEach(() => {
    sinon.restore();
  });
  describe("create()", () => {
    it("should call util create() and return its value", async () => {
      const createStub = sinon.stub(Model, "create").resolves({ _id: id });
      const results = await Account.create(newAccountData);
      expect(
        createStub.calledOnceWith(
          [name, description, startDate, startBalance, budgetId],
          "account"
        )
      ).to.be.true;
      expect(results).to.deep.equal({ _id: id });
    });
  });
  describe("findById()", () => {
    it("should call util findById() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findById")
        .resolves(mockAccountData as RowDataPacket);
      const results = await Account.findById(id);
      expect(findStub.calledOnceWith(id, "account")).to.be.true;
      expect(results).to.deep.equal(mockAccountData);
    });
  });
  describe("findAllByUserId()", () => {
    const userId = "asdfwerwqiohon";
    describe("If user has at least one account", () => {
      beforeEach(() => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([mockAccountData] as RowDataPacket[]);
      });
      it("should query the database", async () => {
        await Account.findAllByUserId(userId);
        expect(
          queryDbStub.calledOnceWith("accounts/findAllByUserId.sql", [userId])
        ).to.be.true;
      });
      it("should return array of account information", async () => {
        const result = await Account.findAllByUserId(userId);
        expect(result).to.deep.equal([mockAccountData]);
      });
    });
    describe("If user has no accounts", () => {
      beforeEach(() => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([] as RowDataPacket[]);
      });
      it("should query the database", async () => {
        await Account.findAllByUserId(userId);
        expect(
          queryDbStub.calledOnceWith("accounts/findAllByUserId.sql", [userId])
        ).to.be.true;
      });
      it("should return an empty array", async () => {
        const result = await Account.findAllByUserId(userId);
        expect(result).to.deep.equal([]);
      });
    });
  });
  describe("update()", () => {
    it("should call util update() and return its value", async () => {
      const createStub = sinon.stub(Model, "update").resolves(true);
      const results = await Account.update(mockAccountData);
      expect(
        createStub.calledOnceWith(
          id,
          [name, description, startDate, startBalance, budgetId],
          "account"
        )
      ).to.be.true;
      expect(results).to.equal(true);
    });
  });
  describe("removeById()", () => {
    it("should call util removeById() and return its value", async () => {
      const removeStub = sinon.stub(Model, "removeById").resolves(true);
      const results = await Account.removeById(id);
      expect(removeStub.calledOnceWith(id, "account")).to.be.true;
      expect(results).to.deep.equal(true);
    });
  });
});
