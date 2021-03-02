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
    describe("If budgetId is in the database...", () => {
      const mockBudgetData = {
        id: 2,
        title: "The Addams Family budget",
        description: "It's a bit scary...",
      };
      it("should return complete budget information", () => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([mockBudgetData] as RowDataPacket[]);
        const result = await Budget.findById(budgetId);
        expect(result).to.deep.equal(mockBudgetData);
      });
    });
    describe("If budgetId is not in the database...", () => {
      it("should return null", () => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([] as RowDataPacket[]);
        const result = await Budget.findById(budgetId);
        expect(result).to.be.null;
      });
    });
  });
  describe("findAllByUserId()", () => {});
});
