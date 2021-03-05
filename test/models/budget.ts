import { expect } from "chai";
import { RowDataPacket } from "mysql2";
import sinon from "sinon";
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
    it("should call util findAllByUserId() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findAllByUserId")
        .resolves([mockBudgetData as RowDataPacket]);
      const results = await Budget.findAllByUserId(userId);
      expect(findStub.calledOnceWith(userId, "budget")).to.be.true;
      expect(results).to.deep.equal([mockBudgetData]);
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
