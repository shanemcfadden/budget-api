import { expect } from "chai";
import { RowDataPacket } from "mysql2";
import sinon, { SinonStub } from "sinon";
import Budget from "../../src/models/budget";
import * as Model from "../../src/util/models";
import * as Database from "../../src/database/Database";
import {
  fakeBudgetAccountData,
  fakeBudgetAccountRows,
  fakeBudgetData,
} from "../fixtures";
import { ServerError } from "../../src/util/errors";

describe("Budget model", () => {
  const { id, title, description } = fakeBudgetData;
  const newBudgetData = {
    title,
    description,
  };
  const budgetDataArr = [title, description];
  const modelName = "budget";

  afterEach(() => {
    sinon.restore();
  });

  describe("create()", () => {
    it("should call util create() and return its value", async () => {
      const createStub = sinon.stub(Model, "create").resolves({ _id: id });
      const results = await Budget.create(newBudgetData);
      expect(createStub.calledOnceWith(budgetDataArr, modelName)).to.be.true;
      expect(results).to.deep.equal({ _id: id });
    });
  });
  describe("findById()", () => {
    it("should call util findById() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findById")
        .resolves(fakeBudgetData as RowDataPacket);
      const results = await Budget.findById(id);
      expect(findStub.calledOnceWith(id, modelName)).to.be.true;
      expect(results).to.deep.equal(fakeBudgetData);
    });
  });
  describe("findByIdWithAccountData()", () => {
    let queryDbStub: SinonStub;
    describe("if budget exists...", () => {
      beforeEach(() => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves(fakeBudgetAccountRows);
      });

      it("should query the database", async () => {
        await Budget.findByIdWithAccountData(id);
        expect(queryDbStub.calledOnce).to.be.true;
        expect(
          queryDbStub.calledOnceWith("budgets/findByIdWithAccountData.sql")
        ).to.be.true;
      });
      it("should return the budget information with all available accounts", async () => {
        const results = await Budget.findByIdWithAccountData(id);
        expect(results).to.deep.equal(fakeBudgetAccountData);
      });
    });
    describe("if budget does not exist", () => {
      beforeEach(() => {
        queryDbStub = sinon.stub(Database, "queryDb").resolves([]);
      });
      it("should query the database", () => {
        return Budget.findByIdWithAccountData(id)
          .then(() => {
            throw new Error(
              "Budget.findByIdWithAccountData should reject here"
            );
          })
          .catch(() => {})
          .finally(() => {
            expect(queryDbStub.calledOnce).to.be.true;
            expect(
              queryDbStub.calledOnceWith("budgets/findByIdWithAccountData.sql")
            ).to.be.true;
          });
      });
      it("should throw a 404 error", () => {
        return Budget.findByIdWithAccountData(id)
          .then(() => {
            throw new Error(
              "Budget.findByIdWithAccountData should reject here"
            );
          })
          .catch((err) => {
            expect(err).to.deep.equal(new ServerError(404, "Budget not found"));
          });
      });
    });
  });
  describe("findDetailsById", () => {});
  describe("findAllByUserId()", () => {
    const userId = "asdfwerwqiohon";
    it("should call util findAllByUserId() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findAllByUserId")
        .resolves([fakeBudgetData as RowDataPacket]);
      const results = await Budget.findAllByUserId(userId);
      expect(findStub.calledOnceWith(userId, modelName)).to.be.true;
      expect(results).to.deep.equal([fakeBudgetData]);
    });
  });
  describe("update()", () => {
    it("should call util update() and return its value", async () => {
      const createStub = sinon.stub(Model, "update").resolves(true);
      const results = await Budget.update(fakeBudgetData);
      expect(createStub.calledOnceWith(id, budgetDataArr, modelName)).to.be
        .true;
      expect(results).to.equal(true);
    });
  });
  describe("removeById()", () => {
    it("should call util removeById() and return its value", async () => {
      const removeStub = sinon.stub(Model, "removeById").resolves(true);
      const results = await Budget.removeById(id);
      expect(removeStub.calledOnceWith(id, modelName)).to.be.true;
      expect(results).to.deep.equal(true);
    });
  });
});
