import { expect } from "chai";
import { RowDataPacket } from "mysql2";
import sinon from "sinon";
import MacroCategory from "../../src/models/macro-category";
import * as Model from "../../src/util/models";

describe("MacroCategory model", () => {
  const newMacroCategoryData = {
    description: "Work",
    isIncome: true,
    budgetId: 4,
  };
  const mockMacroCategoryData = {
    ...newMacroCategoryData,
    id: 2,
  };
  const { id, description, isIncome, budgetId } = mockMacroCategoryData;
  afterEach(() => {
    sinon.restore();
  });
  describe("create()", () => {
    it("should call util create() and return its value", async () => {
      const createStub = sinon.stub(Model, "create").resolves({ _id: id });
      const results = await MacroCategory.create(newMacroCategoryData);
      expect(
        createStub.calledOnceWith(
          [description, isIncome, budgetId],
          "macro-categorie"
        )
      ).to.be.true;
      expect(results).to.deep.equal({ _id: id });
    });
  });
  describe("findById()", () => {
    it("should call util findById() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findById")
        .resolves(mockMacroCategoryData as RowDataPacket);
      const results = await MacroCategory.findById(id);
      expect(findStub.calledOnceWith(id, "macro-categorie")).to.be.true;
      expect(results).to.deep.equal(mockMacroCategoryData);
    });
  });
  describe("findAllByBudgetId()", () => {
    const budgetId = 3321;
    it("should call util findAllByBudgetId() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findAllByBudgetId")
        .resolves([mockMacroCategoryData as RowDataPacket]);
      const results = await MacroCategory.findAllByBudgetId(budgetId);
      expect(findStub.calledOnceWith(budgetId, "macro-categorie")).to.be.true;
      expect(results).to.deep.equal([mockMacroCategoryData]);
    });
  });
  describe("update()", () => {
    it("should call util update() and return its value", async () => {
      const updateSub = sinon.stub(Model, "update").resolves(true);
      const results = await MacroCategory.update(mockMacroCategoryData);
      expect(
        updateSub.calledOnceWith(
          id,
          [description, isIncome, budgetId],
          "macro-categorie"
        )
      ).to.be.true;
      expect(results).to.equal(true);
    });
  });
  describe("removeById()", () => {
    it("should call util removeById() and return its value", async () => {
      const removeStub = sinon.stub(Model, "removeById").resolves(true);
      const results = await MacroCategory.removeById(id);
      expect(removeStub.calledOnceWith(id, "macro-categorie")).to.be.true;
      expect(results).to.deep.equal(true);
    });
  });
});
