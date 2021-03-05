import { expect } from "chai";
import { OkPacket, RowDataPacket } from "mysql2";
import sinon, { SinonStub } from "sinon";
import * as Database from "../../src/database/Database";
import Budget from "../../src/models/budget";
import * as Model from "../../src/util/models";

describe("Budget model", () => {
  const newBudgetData = {
    title: "The Addams Family budget",
    description: "It's a bit scary...",
  };
  const mockBudgetData = {
    ...newBudgetData,
    id: 2,
  };
  const { id, title, description } = mockBudgetData;
  const noAffectedRows = {
    affectedRows: 0,
  } as OkPacket;
  const oneAffectedRow = {
    affectedRows: 1,
  } as OkPacket;
  const twoAffectedRows = {
    affectedRows: 2,
  } as OkPacket;
  let queryDbStub: SinonStub;
  afterEach(() => {
    sinon.restore();
  });
  describe("create()", () => {
    it("should call util create() and return its value", async () => {
      const createStub = sinon.stub(Model, "create").resolves({ _id: id });
      const results = await Budget.create(newBudgetData);
      expect(createStub.calledOnceWith([title, description], "budget")).to.be
        .true;
      expect(results).to.deep.equal({ _id: id });
    });
  });
  describe("findById()", () => {
    it("should call util findById() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findById")
        .resolves(mockBudgetData as RowDataPacket);
      const results = await Budget.findById(id);
      expect(findStub.calledOnceWith(id, "budget")).to.be.true;
      expect(results).to.deep.equal(mockBudgetData);
    });
  });
  describe("findAllByUserId()", () => {
    const userId = "asdfwerwqiohon";
    it("should query the database", async () => {
      queryDbStub = sinon
        .stub(Database, "queryDb")
        .resolves([mockBudgetData] as RowDataPacket[]);
      await Budget.findAllByUserId(userId);
      expect(
        queryDbStub.calledOnceWith("budgets/findAllByUserId.sql", [userId])
      ).to.be.true;
    });
    describe("If user has at least one budget", () => {
      it("should return array of budget information", async () => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([mockBudgetData] as RowDataPacket[]);
        const result = await Budget.findAllByUserId(userId);
        expect(result).to.deep.equal([mockBudgetData]);
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
  describe("update()", () => {
    it("should call util update() and return its value", async () => {
      const createStub = sinon.stub(Model, "update").resolves(true);
      const results = await Budget.update(mockBudgetData);
      expect(createStub.calledOnceWith(id, [title, description], "budget")).to
        .be.true;
      expect(results).to.equal(true);
    });
  });
  describe("removeById()", () => {
    it("should call util removeById() and return its value", async () => {
      const removeStub = sinon.stub(Model, "removeById").resolves(true);
      const results = await Budget.removeById(id);
      expect(removeStub.calledOnceWith(id, "budget")).to.be.true;
      expect(results).to.deep.equal(true);
    });
  });
});
