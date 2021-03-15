import { expect } from "chai";
import { RowDataPacket } from "mysql2";
import sinon from "sinon";
import Subcategory from "../../src/models/subcategory";
import * as Model from "../../src/util/models";
import { fakeSubcategories } from "../fixtures";

describe("Subcategory model", () => {
  const subCategoryData = fakeSubcategories[0];
  const { id, description, categoryId } = subCategoryData;
  const newSubcategoryData = {
    description,
    categoryId,
  };
  const subCategoryArr = [description, categoryId];
  const modelName = "subcategory";

  afterEach(() => {
    sinon.restore();
  });

  describe("create()", () => {
    it("should call util create() and return its value", async () => {
      const createStub = sinon.stub(Model, "create").resolves({ _id: id });
      const results = await Subcategory.create(newSubcategoryData);
      expect(createStub.calledOnceWith(subCategoryArr, modelName)).to.be.true;
      expect(results).to.deep.equal({ _id: id });
    });
  });
  describe("findById()", () => {
    it("should call util findById() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findById")
        .resolves(subCategoryData as RowDataPacket);
      const results = await Subcategory.findById(id);
      expect(findStub.calledOnceWith(id, modelName)).to.be.true;
      expect(results).to.deep.equal(subCategoryData);
    });
  });
  describe("findAllByBudgetId()", () => {
    const budgetId = 3321;
    it("should call util findAllByBudgetId() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findAllByBudgetId")
        .resolves([subCategoryData as RowDataPacket]);
      const results = await Subcategory.findAllByBudgetId(budgetId);
      expect(findStub.calledOnceWith(budgetId, modelName)).to.be.true;
      expect(results).to.deep.equal([subCategoryData]);
    });
  });
  describe("update()", () => {
    it("should call util update() and return its value", async () => {
      const updateSub = sinon.stub(Model, "update").resolves(true);
      const results = await Subcategory.update(subCategoryData);
      expect(updateSub.calledOnceWith(id, subCategoryArr, modelName)).to.be
        .true;
      expect(results).to.equal(true);
    });
  });
  describe("removeById()", () => {
    it("should call util removeById() and return its value", async () => {
      const removeStub = sinon.stub(Model, "removeById").resolves(true);
      const results = await Subcategory.removeById(id);
      expect(removeStub.calledOnceWith(id, modelName)).to.be.true;
      expect(results).to.deep.equal(true);
    });
  });
});
