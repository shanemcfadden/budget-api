import { expect } from "chai";
import { RowDataPacket } from "mysql2";
import sinon from "sinon";
import MicroCategory from "../../src/models/micro-category";
import * as Model from "../../src/util/models";

describe("MicroCategory model", () => {
  const newMicroCategoryData = {
    description: "Work",
    macroCategoryId: 30,
  };
  const mockMicroCategoryData = {
    ...newMicroCategoryData,
    id: 2,
  };
  const { id, description, macroCategoryId } = mockMicroCategoryData;
  afterEach(() => {
    sinon.restore();
  });
  describe("create()", () => {
    it("should call util create() and return its value", async () => {
      const createStub = sinon.stub(Model, "create").resolves({ _id: id });
      const results = await MicroCategory.create(newMicroCategoryData);
      expect(
        createStub.calledOnceWith(
          [description, macroCategoryId],
          "micro-categorie"
        )
      ).to.be.true;
      expect(results).to.deep.equal({ _id: id });
    });
  });
  describe("findById()", () => {
    it("should call util findById() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findById")
        .resolves(mockMicroCategoryData as RowDataPacket);
      const results = await MicroCategory.findById(id);
      expect(findStub.calledOnceWith(id, "micro-categorie")).to.be.true;
      expect(results).to.deep.equal(mockMicroCategoryData);
    });
  });
  describe("findAllByBudgetId()", () => {
    const budgetId = 3321;
    it("should call util findAllByBudgetId() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findAllByBudgetId")
        .resolves([mockMicroCategoryData as RowDataPacket]);
      const results = await MicroCategory.findAllByBudgetId(budgetId);
      expect(findStub.calledOnceWith(budgetId, "micro-categorie")).to.be.true;
      expect(results).to.deep.equal([mockMicroCategoryData]);
    });
  });
  describe("update()", () => {
    it("should call util update() and return its value", async () => {
      const updateSub = sinon.stub(Model, "update").resolves(true);
      const results = await MicroCategory.update(mockMicroCategoryData);
      expect(
        updateSub.calledOnceWith(
          id,
          [description, macroCategoryId],
          "micro-categorie"
        )
      ).to.be.true;
      expect(results).to.equal(true);
    });
  });
  describe("removeById()", () => {
    it("should call util removeById() and return its value", async () => {
      const removeStub = sinon.stub(Model, "removeById").resolves(true);
      const results = await MicroCategory.removeById(id);
      expect(removeStub.calledOnceWith(id, "micro-categorie")).to.be.true;
      expect(results).to.deep.equal(true);
    });
  });
});
