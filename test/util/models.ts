import { expect } from "chai";
import { OkPacket, RowDataPacket } from "mysql2";
import sinon, { SinonStub } from "sinon";
import * as Database from "database/Database";
import {
  create,
  findAllByBudgetId,
  findAllByUserId,
  findById,
  update,
  removeById,
} from "util/models";
import { capitalize } from "util/strings";

describe("util/model.ts", () => {
  let queryDbStub: SinonStub;
  const id = 22;
  const mockData = {
    id,
    name: "This is a name",
    desciription: "A description",
    number: 35,
    bool: true,
  };
  const mockDataEntries = ["This is a name", "A description", 35, true];
  const model = "fakeModel";
  const noAffectedRows = {
    affectedRows: 0,
  } as OkPacket;
  const oneAffectedRow = {
    affectedRows: 1,
  } as OkPacket;
  const twoAffectedRows = {
    affectedRows: 2,
  } as OkPacket;
  afterEach(() => {
    sinon.restore();
  });
  describe("create()", () => {
    beforeEach(() => {
      queryDbStub = sinon.stub(Database, "queryDb").resolves({
        insertId: id,
      } as OkPacket);
    });
    it("Should query the database", async () => {
      await create(mockDataEntries, model);
      expect(
        queryDbStub.calledOnceWith(model + "s/create.sql", mockDataEntries)
      ).to.be.true;
    });
    it("Should return the budget id", async () => {
      const results = await create(mockDataEntries, model);
      expect(results).to.deep.equal({ _id: id });
    });
  });
  describe("findById()", () => {
    describe("If row is in the database...", () => {
      beforeEach(() => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([mockData] as RowDataPacket[]);
      });
      it("should query the database", async () => {
        await findById(id, model);
        expect(queryDbStub.calledOnceWith(model + "s/findById.sql", [id])).to.be
          .true;
      });
      it("should return complete row information", async () => {
        const result = await findById(id, model);
        expect(result).to.deep.equal(mockData);
      });
    });
    describe("If row is not in the database...", () => {
      beforeEach(() => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([] as RowDataPacket[]);
      });
      it("should query the database", async () => {
        await findById(id, model);
        expect(queryDbStub.calledOnceWith(model + "s/findById.sql", [id])).to.be
          .true;
      });
      it("should return null", async () => {
        const result = await findById(id, model);
        expect(result).to.be.null;
      });
    });
  });
  describe("findAllByBudgetId()", () => {
    let queryStub: SinonStub;
    const budgetId = 3321;
    beforeEach(() => {
      queryStub = sinon
        .stub(Database, "queryDb")
        .resolves([mockData] as RowDataPacket[]);
    });
    it("should query database", async () => {
      await findAllByBudgetId(budgetId, model);
      expect(queryStub.calledOnce).to.be.true;
    });
    it("should use accounts/findAllByBudgetId.sql query file", async () => {
      await findAllByBudgetId(budgetId, model);
      expect(
        queryStub.calledWith(model + "s/findAllByBudgetId.sql", [budgetId])
      ).to.be.true;
    });
    it("should return an array of accounts", async () => {
      const results = await findAllByBudgetId(budgetId, model);
      expect(results).to.deep.equal([mockData]);
    });
  });
  describe("findAllByUserId()", () => {
    const userId = "asdfwerwqiohon";
    it("should query the database", async () => {
      queryDbStub = sinon
        .stub(Database, "queryDb")
        .resolves([mockData] as RowDataPacket[]);
      await findAllByUserId(userId, model);
      expect(
        queryDbStub.calledOnceWith(model + "s/findAllByUserId.sql", [userId])
      ).to.be.true;
    });
    describe("If user has at least one of a given model", () => {
      it("should return array of model information", async () => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([mockData] as RowDataPacket[]);
        const result = await findAllByUserId(userId, model);
        expect(result).to.deep.equal([mockData]);
      });
    });
    describe("If user has none of a given model", () => {
      it("should return an empty array", async () => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([] as RowDataPacket[]);
        const result = await findAllByUserId(userId, model);
        expect(result).to.deep.equal([]);
      });
    });
  });
  describe("update()", () => {
    describe("If row exists", () => {
      beforeEach(() => {
        queryDbStub = sinon.stub(Database, "queryDb").resolves(oneAffectedRow);
      });
      it("should query the database", async () => {
        await update(id, mockDataEntries, model);
        expect(
          queryDbStub.calledOnceWith(model + "s/update.sql", [
            ...mockDataEntries,
            id,
          ])
        ).to.be.true;
      });
      it("should return true", async () => {
        const result = await update(id, mockDataEntries, model);
        expect(result).to.be.true;
      });
    });
    describe("If row does not exist", () => {
      beforeEach(() => {
        queryDbStub = sinon.stub(Database, "queryDb").resolves(noAffectedRows);
      });
      it("should query the database", () => {
        return update(id, mockDataEntries, model)
          .catch(() => {})
          .finally(() => {
            expect(
              queryDbStub.calledOnceWith(model + "s/update.sql", [
                ...mockDataEntries,
                id,
              ])
            ).to.be.true;
          });
      });
      it("should throw an error", () => {
        return update(id, mockDataEntries, model)
          .then(() => {
            throw new Error("update should reject");
          })
          .catch((error) => {
            expect(error.message).to.equal(
              capitalize(model) + " does not exist"
            );
          });
      });
    });
    describe("If more than one row is deleted by faulty query", () => {
      it("should throw an error", () => {
        sinon.stub(Database, "queryDb").resolves(twoAffectedRows);
        return update(id, mockDataEntries, model)
          .then(() => {
            throw new Error("update() should reject");
          })
          .catch((error) => {
            expect(error.message).to.equal(
              `Multiple rows updated due to faulty query. Fix ${model}s/update.sql`
            );
          });
      });
    });
  });
  describe("removeById()", () => {
    describe("If row exists", () => {
      beforeEach(() => {
        queryDbStub = sinon.stub(Database, "queryDb").resolves(oneAffectedRow);
      });
      it("should query the database", async () => {
        await removeById(id, model);
        expect(queryDbStub.calledOnceWith(model + "s/removeById.sql", [id])).to
          .be.true;
      });
      it("should return true", async () => {
        const result = await removeById(id, model);
        expect(result).to.be.true;
      });
    });
    describe("If row does not exist", () => {
      beforeEach(() => {
        queryDbStub = sinon.stub(Database, "queryDb").resolves(noAffectedRows);
      });
      it("should query the database", () => {
        return removeById(id, model)
          .catch(() => {})
          .finally(() => {
            expect(queryDbStub.calledOnceWith(model + "s/removeById.sql", [id]))
              .to.be.true;
          });
      });
      it("should throw an error", () => {
        return removeById(id, model)
          .then(() => {
            throw new Error("removeById should reject");
          })
          .catch((error) => {
            expect(error.message).to.equal(
              capitalize(model) + " does not exist"
            );
          });
      });
    });
    describe("If more than one row is deleted by faulty query", () => {
      it("should throw an error", () => {
        sinon.stub(Database, "queryDb").resolves(twoAffectedRows);
        return removeById(id, model)
          .then(() => {
            throw new Error("removeById should reject");
          })
          .catch((error) => {
            expect(error.message).to.equal(
              `Multiple rows deleted due to faulty query. Fix ${model}s/removeById.sql`
            );
          });
      });
    });
  });
});
