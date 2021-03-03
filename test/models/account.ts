import { expect } from "chai";
import { OkPacket, RowDataPacket } from "mysql2";
import sinon, { SinonStub } from "sinon";
import * as Database from "../../src/database/Database";
import Account from "../../src/models/account";

describe("Account model", () => {
  let queryDbStub: SinonStub;
  afterEach(() => {
    sinon.restore();
  });
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
  describe("create()", () => {
    let queryDbStub: SinonStub;
    beforeEach(() => {
      queryDbStub = sinon.stub(Database, "queryDb").resolves({
        insertId: 2,
      } as OkPacket);
    });
    it("Should query the database", async () => {
      await Account.create(newAccountData);
      expect(queryDbStub.calledOnce).to.be.true;
    });
    it("Should return the account id", async () => {
      const results = await Account.create(newAccountData);
      expect(results).to.deep.equal({ _id: 2 });
    });
  });
  describe("findById()", () => {
    const { id } = mockAccountData;
    it("should query the database", async () => {
      queryDbStub = sinon
        .stub(Database, "queryDb")
        .resolves([mockAccountData] as RowDataPacket[]);
      await Account.findById(id);
      expect(queryDbStub.calledOnceWith("accounts/findById.sql", [id])).to.be
        .true;
    });
    describe("If account is in the database...", () => {
      it("should return complete account information", async () => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([mockAccountData] as RowDataPacket[]);
        const result = await Account.findById(id);
        expect(result).to.deep.equal(mockAccountData);
      });
    });
    describe("If account is not in the database...", () => {
      it("should return null", async () => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([] as RowDataPacket[]);
        const result = await Account.findById(id);
        expect(result).to.be.null;
      });
    });
  });
  describe("findAllByUserId()", () => {
    const userId = "asdfwerwqiohon";
    it("should query the database", async () => {
      queryDbStub = sinon
        .stub(Database, "queryDb")
        .resolves([mockAccountData] as RowDataPacket[]);
      await Account.findAllByUserId(userId);
      expect(
        queryDbStub.calledOnceWith("accounts/findAllByUserId.sql", [userId])
      ).to.be.true;
    });
    describe("If user has at least one account", () => {
      it("should return array of account information", async () => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([mockAccountData] as RowDataPacket[]);
        const result = await Account.findAllByUserId(userId);
        expect(result).to.deep.equal([mockAccountData]);
      });
    });
    describe("If user has no accounts", () => {
      it("should return an empty array", async () => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([] as RowDataPacket[]);
        const result = await Account.findAllByUserId(userId);
        expect(result).to.deep.equal([]);
      });
    });
  });
  describe("update()", () => {
    it("should query the database", async () => {
      const {
        id,
        name,
        description,
        startDate,
        startBalance,
        budgetId,
      } = mockAccountData;
      queryDbStub = sinon
        .stub(Database, "queryDb")
        .resolves({ affectedRows: 1 } as OkPacket);
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
    describe("If account exists", () => {
      it("should return true", async () => {
        sinon.stub(Database, "queryDb").resolves({
          affectedRows: 1,
        } as OkPacket);
        const result = await Account.update(mockAccountData);
        expect(result).to.be.true;
      });
    });
    describe("If account does not exist", () => {
      it("should throw an error", () => {
        sinon.stub(Database, "queryDb").resolves({
          affectedRows: 0,
        } as OkPacket);
        return Account.update(mockAccountData)
          .then(() => {
            throw new Error("update should reject");
          })
          .catch((error) => {
            expect(error.message).to.equal("Account does not exist");
          });
      });
      describe("If more than one row is deleted by faulty query", () => {
        it("should throw an error", () => {
          sinon.stub(Database, "queryDb").resolves({
            affectedRows: 2,
          } as OkPacket);
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
    });
    describe("removeById()", () => {
      const { id } = mockAccountData;
      it("should query the database", async () => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves({ affectedRows: 1 } as OkPacket);
        await Account.removeById(id);
        expect(queryDbStub.calledOnceWith("accounts/removeById.sql", [id])).to
          .be.true;
      });
      describe("If account exists", () => {
        it("should return true", async () => {
          sinon.stub(Database, "queryDb").resolves({
            affectedRows: 1,
          } as OkPacket);
          const result = await Account.removeById(id);
          expect(result).to.be.true;
        });
      });
      describe("If account does not exist", () => {
        it("should throw an error", () => {
          sinon.stub(Database, "queryDb").resolves({
            affectedRows: 0,
          } as OkPacket);
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
          sinon.stub(Database, "queryDb").resolves({
            affectedRows: 2,
          } as OkPacket);
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
