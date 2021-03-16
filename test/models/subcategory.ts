import { expect } from "chai";
import { RowDataPacket } from "mysql2";
import sinon, { SinonStub } from "sinon";
import Subcategory from "../../src/models/subcategory";
import Transaction from "../../src/models/transaction";
import * as Model from "../../src/util/models";
import * as Database from "../../src/database/Database";
import { fakeSubcategories, fakeTransactions } from "../fixtures";

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

  describe("checkUserPermissions()", () => {
    const fakeUserId = "asdfqwerio23";
    let queryDbStub: SinonStub;
    describe("if database query returns an empty set...", () => {
      beforeEach(() => {
        queryDbStub = sinon.stub(Database, "queryDb").resolves([]);
      });
      it("should query the database", async () => {
        await Subcategory.checkUserPermissions(id, fakeUserId);
        expect(queryDbStub.calledOnce).to.be.true;
        expect(
          queryDbStub.calledOnceWith("subcategories/checkUserPermissions.sql", [
            id,
            fakeUserId,
          ])
        ).to.be.true;
      });
      it("should return false", async () => {
        const result = await Subcategory.checkUserPermissions(id, fakeUserId);
        expect(result).to.be.false;
      });
    });
    describe("if database query returns a nonempty set...", () => {
      beforeEach(() => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([{ id }] as RowDataPacket[]);
      });
      it("should query the database", async () => {
        await Subcategory.checkUserPermissions(id, fakeUserId);
        expect(queryDbStub.calledOnce).to.be.true;
        expect(
          queryDbStub.calledOnceWith("subcategories/checkUserPermissions.sql", [
            id,
            fakeUserId,
          ])
        ).to.be.true;
      });
      it("should return false", async () => {
        const result = await Subcategory.checkUserPermissions(id, fakeUserId);
        expect(result).to.be.true;
      });
    });
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
  describe("hasTransactions()", () => {
    describe("if Transactions.findAllBySubcategory() returns an empty set...", () => {
      beforeEach(() => {
        sinon.stub(Transaction, "findAllBySubcategoryId").resolves([]);
      });
      it("should resolve false", async () => {
        const result = await Subcategory.hasTransactions(id);
        expect(result).to.be.false;
      });
    });
    describe("if Transactions.findAllBySubcategory() returns a nonempty set...", () => {
      beforeEach(() => {
        sinon
          .stub(Transaction, "findAllBySubcategoryId")
          .resolves(fakeTransactions);
      });
      it("should resolve true", async () => {
        const result = await Subcategory.hasTransactions(id);
        expect(result).to.be.true;
      });
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
