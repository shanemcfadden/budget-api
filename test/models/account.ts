import { expect } from "chai";
import { OkPacket, RowDataPacket } from "mysql2";
import sinon, { mock, SinonStub } from "sinon";
import * as Database from "../../src/database/Database";
import Account from "../../src/models/account";

describe("Account model", () => {
  let queryDbStub: SinonStub;
  afterEach(() => {
    sinon.restore();
  });
  describe("findById()", () => {
    const accountId = 30;
    const mockAccountData = {
      id: 2,
      name: "The Addams Family account",
      description: "It's a bit scary...",
      startDate: new Date("2020-01-11"),
      startBalance: 100,
      budgetId: 3,
    };
    it("should query the database", async () => {
      queryDbStub = sinon
        .stub(Database, "queryDb")
        .resolves([mockAccountData] as RowDataPacket[]);
      await Account.findById(accountId);
      expect(queryDbStub.calledOnceWith("accounts/findById.sql", [accountId]))
        .to.be.true;
    });
    describe("If accountId is in the database...", () => {
      it("should return complete account information", async () => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([mockAccountData] as RowDataPacket[]);
        const result = await Account.findById(accountId);
        expect(result).to.deep.equal(mockAccountData);
      });
    });
    describe("If accountId is not in the database...", () => {
      it("should return null", async () => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([] as RowDataPacket[]);
        const result = await Account.findById(accountId);
        expect(result).to.be.null;
      });
    });
  });
  describe("findAllByUserId()", () => {
    const userId = "asdfwerwqiohon";
    const mockAccountData = {
      id: 2,
      title: "The Addams Family account",
      description: "It's a bit scary...",
    };
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
  describe("removeById()", () => {
    const mockAccountId = 23;
    describe("If account exists", () => {
      it("should return true", async () => {
        sinon.stub(Database, "queryDb").resolves({
          affectedRows: 1,
        } as OkPacket);
        const result = await Account.removeById(mockAccountId);
        expect(result).to.be.true;
      });
    });
    describe("If account does not exist", () => {
      it("should throw an error", () => {
        sinon.stub(Database, "queryDb").resolves({
          affectedRows: 0,
        } as OkPacket);
        return Account.removeById(mockAccountId)
          .then(() => {
            throw new Error("findById should reject");
          })
          .catch((error) => {
            expect(error).to.equal("Account does not exist");
          });
      });
    });
  });
});
