import { expect } from "chai";
import { RowDataPacket } from "mysql2";
import sinon, { SinonStub } from "sinon";
import Category from "../../src/models/category";
import * as Model from "../../src/util/models";
import * as Database from "../../src/database/Database";
import {
  fakeCategoriesData,
  fakeCategories,
  fakeSubcategoryRows,
} from "../fixtures";

describe("Category model", () => {
  const categoryData = fakeCategories[0];
  const { id, description, isIncome, budgetId } = categoryData;
  const newCategoryData = {
    description,
    isIncome,
    budgetId,
  };
  const categoryArr = [description, isIncome, budgetId];
  const modelName = "category";

  afterEach(() => {
    sinon.restore();
  });

  describe("create()", () => {
    it("should call util create() and return its value", async () => {
      const createStub = sinon.stub(Model, "create").resolves({ _id: id });
      const results = await Category.create(newCategoryData);
      expect(createStub.calledOnceWith(categoryArr, modelName)).to.be.true;
      expect(results).to.deep.equal({ _id: id });
    });
  });
  describe("findById()", () => {
    it("should call util findById() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findById")
        .resolves(categoryData as RowDataPacket);
      const results = await Category.findById(id);
      expect(findStub.calledOnceWith(id, modelName)).to.be.true;
      expect(results).to.deep.equal(categoryData);
    });
  });
  describe("findAllByBudgetId()", () => {
    it("should call util findAllByBudgetId() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findAllByBudgetId")
        .resolves([categoryData as RowDataPacket]);
      const results = await Category.findAllByBudgetId(budgetId);
      expect(findStub.calledOnceWith(budgetId, modelName)).to.be.true;
      expect(results).to.deep.equal([categoryData]);
    });
  });
  describe("findAllByBudgetIdWithSubcategories()", () => {
    let queryDbStub: SinonStub;
    beforeEach(() => {
      queryDbStub = sinon
        .stub(Database, "queryDb")
        .resolves(fakeSubcategoryRows);
    });
    it("should query the database", async () => {
      await Category.findAllByBudgetIdWithSubcategories(budgetId);
      expect(queryDbStub.calledOnce).to.be.true;
      expect(
        queryDbStub.calledOnceWith(
          "categories/findAllByBudgetIdWithSubcategories.sql"
        )
      ).to.be.true;
    });
    it("should return the categories data", async () => {
      const results = await Category.findAllByBudgetIdWithSubcategories(
        budgetId
      );
      expect(results).to.deep.equal(fakeCategoriesData);
    });
  });
  describe("update()", () => {
    it("should call util update() and return its value", async () => {
      const updateSub = sinon.stub(Model, "update").resolves(true);
      const results = await Category.update(categoryData);
      expect(updateSub.calledOnceWith(id, categoryArr, modelName)).to.be.true;
      expect(results).to.equal(true);
    });
  });
  describe("removeById()", () => {
    it("should call util removeById() and return its value", async () => {
      const removeStub = sinon.stub(Model, "removeById").resolves(true);
      const results = await Category.removeById(id);
      expect(removeStub.calledOnceWith(id, modelName)).to.be.true;
      expect(results).to.deep.equal(true);
    });
  });
});
