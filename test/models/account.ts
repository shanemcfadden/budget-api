import { expect } from "chai";
import { OkPacket, RowDataPacket } from "mysql2";
import sinon, { SinonStub } from "sinon";
import * as Database from "../../src/database/Database";
import Account from "../../src/models/account";

describe("Account model", () => {
  let queryDbStub: SinonStub;
  const newAccountData = {
    name: "The Addams Family account",
    description: "It's a bit scary...",
    startDate: new Date("2020-01-11"),
    startBalance: 100,
    budgetId: 3,
  };
  const mockAccountData = {
    ...newAccountData,
    id: 2,
  };
  const {
    id,
    name,
    description,
    startDate,
    startBalance,
    budgetId,
  } = mockAccountData;
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
        insertId: 2,
      } as OkPacket);
    });
    it("Should query the database", async () => {
      await Account.create(newAccountData);
      expect(
        queryDbStub.calledOnceWith("accounts/create.sql", [
          name,
          description,
          startDate,
          startBalance,
          budgetId,
        ])
      ).to.be.true;
    });
    it("Should return the account id", async () => {
      const results = await Account.create(newAccountData);
      expect(results).to.deep.equal({ _id: 2 });
    });
  });
  describe("findById()", () => {
    describe("If account is in the database...", () => {
      beforeEach(() => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([mockAccountData] as RowDataPacket[]);
      });
      it("should query the database", async () => {
        await Account.findById(id);
        expect(queryDbStub.calledOnceWith("accounts/findById.sql", [id])).to.be
          .true;
      });
      it("should return complete account information", async () => {
        const result = await Account.findById(id);
        expect(result).to.deep.equal(mockAccountData);
      });
    });
    describe("If account is not in the database...", () => {
      beforeEach(() => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([] as RowDataPacket[]);
      });
      it("should query the database", async () => {
        await Account.findById(id);
        expect(queryDbStub.calledOnceWith("accounts/findById.sql", [id])).to.be
          .true;
      });
      it("should return null", async () => {
        const result = await Account.findById(id);
        expect(result).to.be.null;
      });
    });
  });
  describe("findAllByUserId()", () => {
    const userId = "asdfwerwqiohon";
    describe("If user has at least one account", () => {
      beforeEach(() => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([mockAccountData] as RowDataPacket[]);
      });
      it("should query the database", async () => {
        await Account.findAllByUserId(userId);
        expect(
          queryDbStub.calledOnceWith("accounts/findAllByUserId.sql", [userId])
        ).to.be.true;
      });
      it("should return array of account information", async () => {
        const result = await Account.findAllByUserId(userId);
        expect(result).to.deep.equal([mockAccountData]);
      });
    });
    describe("If user has no accounts", () => {
      beforeEach(() => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([] as RowDataPacket[]);
      });
      it("should query the database", async () => {
        await Account.findAllByUserId(userId);
        expect(
          queryDbStub.calledOnceWith("accounts/findAllByUserId.sql", [userId])
        ).to.be.true;
      });
      it("should return an empty array", async () => {
        const result = await Account.findAllByUserId(userId);
        expect(result).to.deep.equal([]);
      });
    });
  });
  describe("update()", () => {
    describe("If account exists", () => {
      beforeEach(() => {
        queryDbStub = sinon.stub(Database, "queryDb").resolves(oneAffectedRow);
      });
      it("should query the database", async () => {
        await Account.update(mockAccountData);
        expect(
          queryDbStub.calledOnceWith("accounts/update.sql", [
            name,
            description,
            startDate,
            startBalance,
            budgetId,
            id,
          ])
        ).to.be.true;
      });
      it("should return true", async () => {
        const result = await Account.update(mockAccountData);
        expect(result).to.be.true;
      });
    });
    describe("If account does not exist", () => {
      beforeEach(() => {
        queryDbStub = sinon.stub(Database, "queryDb").resolves(noAffectedRows);
      });
      it("should query the database", () => {
        return Account.update(mockAccountData)
          .catch(() => {})
          .finally(() => {
            expect(
              queryDbStub.calledOnceWith("accounts/update.sql", [
                name,
                description,
                startDate,
                startBalance,
                budgetId,
                id,
              ])
            ).to.be.true;
          });
      });
      it("should throw an error", () => {
        return Account.update(mockAccountData)
          .then(() => {
            throw new Error("update should reject");
          })
          .catch((error) => {
            expect(error.message).to.equal("Account does not exist");
          });
      });
    });
    describe("If more than one row is deleted by faulty query", () => {
      it("should throw an error", () => {
        sinon.stub(Database, "queryDb").resolves(twoAffectedRows);
        return Account.update(mockAccountData)
          .then(() => {
            throw new Error("update() should reject");
          })
          .catch((error) => {
            expect(error.message).to.equal(
              "Multiple rows updated due to faulty query. Fix accounts/update.sql"
            );
          });
      });
    });
    describe("removeById()", () => {
      describe("If account exists", () => {
        beforeEach(() => {
          queryDbStub = sinon
            .stub(Database, "queryDb")
            .resolves(oneAffectedRow);
        });
        it("should query the database", async () => {
          await Account.removeById(id);
          expect(queryDbStub.calledOnceWith("accounts/removeById.sql", [id])).to
            .be.true;
        });
        it("should return true", async () => {
          const result = await Account.removeById(id);
          expect(result).to.be.true;
        });
      });
      describe("If account does not exist", () => {
        beforeEach(() => {
          queryDbStub = sinon
            .stub(Database, "queryDb")
            .resolves(noAffectedRows);
        });
        it("should query the database", () => {
          return Account.removeById(id)
            .catch(() => {})
            .finally(() => {
              expect(
                queryDbStub.calledOnceWith("accounts/removeById.sql", [id])
              ).to.be.true;
            });
        });
        it("should throw an error", () => {
          return Account.removeById(id)
            .then(() => {
              throw new Error("removeById should reject");
            })
            .catch((error) => {
              expect(error.message).to.equal("Account does not exist");
            });
        });
      });
      describe("If more than one row is deleted by faulty query", () => {
        it("should throw an error", () => {
          sinon.stub(Database, "queryDb").resolves(twoAffectedRows);
          return Account.removeById(id)
            .then(() => {
              throw new Error("removeById should reject");
            })
            .catch((error) => {
              expect(error.message).to.equal(
                "Multiple rows deleted due to faulty query. Fix accounts/removeById.sql"
              );
            });
        });
      });
    });
  });
});
