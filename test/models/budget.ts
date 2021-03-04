import { expect } from "chai";
import { OkPacket, RowDataPacket } from "mysql2";
import sinon, { SinonStub } from "sinon";
import * as Database from "../../src/database/Database";
import Budget from "../../src/models/budget";

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
    beforeEach(() => {
      queryDbStub = sinon.stub(Database, "queryDb").resolves({
        insertId: 2,
      } as OkPacket);
    });
    it("Should query the database", async () => {
      await Budget.create(newBudgetData);
      expect(queryDbStub.calledOnce).to.be.true;
    });
    it("Should return the budget id", async () => {
      const results = await Budget.create(newBudgetData);
      expect(results).to.deep.equal({ _id: 2 });
    });
  });
  describe("findById()", () => {
    const budgetId = 30;
    it("should query the database", async () => {
      queryDbStub = sinon
        .stub(Database, "queryDb")
        .resolves([mockBudgetData] as RowDataPacket[]);
      await Budget.findById(budgetId);
      expect(queryDbStub.calledOnceWith("budgets/findById.sql", [budgetId])).to
        .be.true;
    });
    describe("If budgetId is in the database...", () => {
      it("should return complete budget information", async () => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([mockBudgetData] as RowDataPacket[]);
        const result = await Budget.findById(budgetId);
        expect(result).to.deep.equal(mockBudgetData);
      });
    });
    describe("If budgetId is not in the database...", () => {
      it("should return null", async () => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([] as RowDataPacket[]);
        const result = await Budget.findById(budgetId);
        expect(result).to.be.null;
      });
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
    describe("If budget exists", () => {
      beforeEach(() => {
        queryDbStub = sinon.stub(Database, "queryDb").resolves(oneAffectedRow);
      });
      it("should query the database", async () => {
        await Budget.update(mockBudgetData);
        expect(
          queryDbStub.calledOnceWith("budgets/update.sql", [
            title,
            description,
            id,
          ])
        ).to.be.true;
      });
      it("should return true", async () => {
        const result = await Budget.update(mockBudgetData);
        expect(result).to.be.true;
      });
    });
    describe("If budget does not exist", () => {
      beforeEach(() => {
        queryDbStub = sinon.stub(Database, "queryDb").resolves(noAffectedRows);
      });
      it("should query the database", () => {
        return Budget.update(mockBudgetData)
          .catch(() => {})
          .finally(() => {
            expect(
              queryDbStub.calledOnceWith("budgets/update.sql", [
                title,
                description,
                id,
              ])
            ).to.be.true;
          });
      });
      it("should throw an error", () => {
        return Budget.update(mockBudgetData)
          .then(() => {
            throw new Error("update should reject");
          })
          .catch((error) => {
            expect(error.message).to.equal("Budget does not exist");
          });
      });
    });
    describe("If more than one row is deleted by faulty query", () => {
      it("should throw an error", () => {
        sinon.stub(Database, "queryDb").resolves(twoAffectedRows);
        return Budget.update(mockBudgetData)
          .then(() => {
            throw new Error("update() should reject");
          })
          .catch((error) => {
            expect(error.message).to.equal(
              "Multiple rows updated due to faulty query. Fix budgets/update.sql"
            );
          });
      });
    });
    describe("removeById()", () => {
      describe("If budget exists", () => {
        beforeEach(() => {
          queryDbStub = sinon
            .stub(Database, "queryDb")
            .resolves(oneAffectedRow);
        });
        it("should query the database", async () => {
          await Budget.removeById(id);
          expect(queryDbStub.calledOnceWith("budgets/removeById.sql", [id])).to
            .be.true;
        });
        it("should return true", async () => {
          const result = await Budget.removeById(id);
          expect(result).to.be.true;
        });
      });
      describe("If budget does not exist", () => {
        beforeEach(() => {
          queryDbStub = sinon
            .stub(Database, "queryDb")
            .resolves(noAffectedRows);
        });
        it("should query the database", () => {
          return Budget.removeById(id)
            .catch(() => {})
            .finally(() => {
              expect(queryDbStub.calledOnceWith("budgets/removeById.sql", [id]))
                .to.be.true;
            });
        });
        it("should throw an error", () => {
          return Budget.removeById(id)
            .then(() => {
              throw new Error("removeById should reject");
            })
            .catch((error) => {
              expect(error.message).to.equal("Budget does not exist");
            });
        });
      });
      describe("If more than one row is deleted by faulty query", () => {
        it("should throw an error", () => {
          sinon.stub(Database, "queryDb").resolves(twoAffectedRows);
          return Budget.removeById(id)
            .then(() => {
              throw new Error("removeById should reject");
            })
            .catch((error) => {
              expect(error.message).to.equal(
                "Multiple rows deleted due to faulty query. Fix budgets/removeById.sql"
              );
            });
        });
      });
    });
  });
});
