import { expect } from "chai";
import { RowDataPacket } from "mysql2";
import sinon, { SinonStub } from "sinon";
import * as Database from "../../src/database/Database";
import Budget from "../../src/models/budget";

describe("Budget model", () => {
  let queryDbStub: SinonStub;
  afterEach(() => {
    sinon.restore();
  });
  describe("findById()", () => {
    const budgetId = 30;
    const mockBudgetData = {
      id: 2,
      title: "The Addams Family budget",
      description: "It's a bit scary...",
    };
    it("should query the database", async () => {
      queryDbStub = sinon
        .stub(Database, "queryDb")
        .resolves([mockBudgetData] as RowDataPacket[]);
      await Budget.findById(budgetId);
      expect(queryDbStub.calledOnceWith("budget/findById.sql", [budgetId])).to
        .be.true;
    });
    describe("If budgetId is in the database...", () => {
      it("should return complete budget information", async () => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([mockBudgetData] as RowDataPacket[]);
        const result = await Budget.findById(budgetId);
        expect(result).to.deep.equal(mockBudgetData);
      });
    });
    describe("If budgetId is not in the database...", () => {
      it("should return null", async () => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([] as RowDataPacket[]);
        const result = await Budget.findById(budgetId);
        expect(result).to.be.null;
      });
    });
  });
  describe("findAllByUserId()", () => {
    const userId = "asdfwerwqiohon";
    const mockBudgetData = {
      id: 2,
      title: "The Addams Family budget",
      description: "It's a bit scary...",
    };
    it("should query the database", async () => {
      queryDbStub = sinon
        .stub(Database, "queryDb")
        .resolves([mockBudgetData] as RowDataPacket[]);
      await Budget.findAllByUserId(userId);
      expect(queryDbStub.calledOnceWith("budget/findAllByUserId.sql", [userId]))
        .to.be.true;
    });
    describe("If user has at least one budget", () => {
      it("should return array of budget information", async () => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([mockBudgetData] as RowDataPacket[]);
        const result = await Budget.findAllByUserId(userId);
        expect(result).to.deep.equal(mockBudgetData);
      });
    });
    describe("If user has no budgets", () => {
      it("should return an empty array", async () => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([] as RowDataPacket[]);
        const result = await Budget.findAllByUserId(userId);
        expect(result).to.deep.equal([]);
      });
    });
  });
});
