import sinon, { SinonStub } from "sinon";
import chai from "chai";
import chaiuuid from "chai-uuid";
import { RowDataPacket } from "mysql2";
import User from "models/user";
import * as Database from "database/Database";
import * as Model from "util/models";
import { fakeAccounts, fakeUser } from "../fixtures";
import Account from "models/account";
import Category from "models/category";
import Subcategory from "models/subcategory";

chai.use(chaiuuid);
const expect = chai.expect;

describe("User model", () => {
  let queryDbStub: SinonStub;
  const { email, password, firstName, lastName, _id } = fakeUser;
  const modelName = "user";
  const fakeBudgetId = 304;

  afterEach(() => {
    sinon.restore();
  });

  describe("findByEmail()", () => {
    const { email } = fakeUser;
    describe("If user with email exists in the database...", () => {
      beforeEach(() => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([fakeUser] as RowDataPacket[]);
      });
      it("should query the database", async () => {
        await User.findByEmail(email);
        expect(queryDbStub.calledOnceWith("users/findByEmail.sql", [email])).to
          .be.true;
      });
      it("should return complete user object", async () => {
        const result = await User.findByEmail(email);
        expect(result).to.deep.equal(fakeUser);
      });
    });
    describe("If email doesn't exist in the database...", () => {
      beforeEach(() => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([] as RowDataPacket[]);
      });
      it("should query the database", async () => {
        await User.findByEmail(email);
        expect(queryDbStub.calledOnceWith("users/findByEmail.sql", [email])).to
          .be.true;
      });
      it("should return null", async () => {
        const result = await User.findByEmail(email);
        expect(result).to.be.null;
      });
    });
  });
  describe("create()", () => {
    beforeEach(() => {
      queryDbStub = sinon.stub(Database, "queryDb").resolves();
    });
    const newUserData = {
      ...fakeUser,
      _id: undefined,
    };
    it("should create a unique id for each user", async () => {
      const result = await User.create(newUserData);
      expect(result).to.have.property("_id");
      // @ts-ignore
      expect(result?._id).to.be.a.uuid("v4");
    });
    it("should create a user with a query", async () => {
      await User.create(newUserData);
      expect(
        queryDbStub.calledOnceWith("users/create.sql", [
          sinon.match.string,
          email,
          password,
          firstName,
          lastName,
        ])
      ).to.be.true;
    });
    it("should return an object with the user id", async () => {
      const result = await User.create(newUserData);
      expect(result).to.have.all.keys(["_id"]);
    });
  });
  describe("findById()", () => {
    it("should call util findById() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findById")
        .resolves(fakeUser as RowDataPacket);
      const results = await User.findById(_id);
      expect(findStub.calledOnceWith(_id, modelName)).to.be.true;
      expect(results).to.deep.equal(fakeUser);
    });
  });
  describe("findAllByBudgetId()", () => {
    it("should call util findAllByBudgetId() and return its value", async () => {
      const findStub = sinon
        .stub(Model, "findAllByBudgetId")
        .resolves([fakeUser] as RowDataPacket[]);
      const results = await User.findAllByBudgetId(fakeBudgetId);
      expect(findStub.calledOnceWith(fakeBudgetId, modelName)).to.be.true;
      expect(results).to.deep.equal([fakeUser]);
    });
  });
  describe("update()", () => {
    it("should call util update() and return its value", async () => {
      const createStub = sinon.stub(Model, "update").resolves(true);
      const results = await User.update(fakeUser);
      expect(
        createStub.calledOnceWith(_id, [email, firstName, lastName], modelName)
      ).to.be.true;
      expect(results).to.equal(true);
    });
  });
  describe("removeById()", () => {
    it("should call util removeById() and return its value", async () => {
      const removeStub = sinon.stub(Model, "removeById").resolves(true);
      const results = await User.removeById(_id);
      expect(removeStub.calledOnceWith(_id, modelName)).to.be.true;
      expect(results).to.deep.equal(true);
    });
  });
  describe("hasPermissionToEditAccount()", () => {
    let findAllByAccountIdStub: SinonStub;
    const fakeAccountId = fakeAccounts[0].id;
    describe("if account is not listed in findAllByUserId...", () => {
      beforeEach(() => {
        findAllByAccountIdStub = sinon
          .stub(Account, "findAllByUserId")
          .resolves([]);
      });
      it("should return false", async () => {
        const result = await User.hasPermissionToEditAccount(
          _id,
          fakeAccountId
        );
        expect(result).to.be.false;
      });
    });
    describe("if account is listed in results of findAllByUserId...", () => {
      beforeEach(() => {
        findAllByAccountIdStub = sinon
          .stub(Account, "findAllByUserId")
          .resolves(fakeAccounts);
      });
      it("should return true", async () => {
        const result = await User.hasPermissionToEditAccount(
          _id,
          fakeAccountId
        );
        expect(result).to.be.true;
      });
    });
  });
  describe("hasPermissionToEditBudget()", () => {
    let findAllByBudgetIdStub: SinonStub;
    describe("if user is not listed in findAllByBudgetId...", () => {
      beforeEach(() => {
        findAllByBudgetIdStub = sinon
          .stub(User, "findAllByBudgetId")
          .resolves([]);
      });
      it("should return false", async () => {
        const result = await User.hasPermissionToEditBudget(_id, fakeBudgetId);
        expect(result).to.be.false;
      });
    });
    describe("if user is listed in results of findAllByBudgetId...", () => {
      beforeEach(() => {
        findAllByBudgetIdStub = sinon
          .stub(User, "findAllByBudgetId")
          .resolves([fakeUser]);
      });
      it("should return true", async () => {
        const result = await User.hasPermissionToEditBudget(_id, fakeBudgetId);
        expect(result).to.be.true;
      });
    });
  });
  describe("hasPermissionToEditCategory()", () => {
    const fakeCategoryId = 12382;
    describe("if Category.checkUserPermissions() returns false...", () => {
      beforeEach(() => {
        sinon.stub(Category, "checkUserPermissions").resolves(false);
      });
      it("should resolve false", async () => {
        const result = await User.hasPermissionToEditCategory(
          _id,
          fakeCategoryId
        );
        expect(result).to.be.false;
      });
    });
    describe("if Category.checkUserPermissions() returns true...", () => {
      beforeEach(() => {
        sinon.stub(Category, "checkUserPermissions").resolves(true);
      });
      it("should resolve true", async () => {
        const result = await User.hasPermissionToEditCategory(
          _id,
          fakeCategoryId
        );
        expect(result).to.be.true;
      });
    });
  });
  describe("hasPermissionToEditSubcategory()", () => {
    const fakeSubcategoryId = 12382;
    describe("if Subcategory.checkUserPermissions() returns false...", () => {
      beforeEach(() => {
        sinon.stub(Subcategory, "checkUserPermissions").resolves(false);
      });
      it("should resolve false", async () => {
        const result = await User.hasPermissionToEditSubcategory(
          _id,
          fakeSubcategoryId
        );
        expect(result).to.be.false;
      });
    });
    describe("if Subcategory.checkUserPermissions() returns true...", () => {
      beforeEach(() => {
        sinon.stub(Subcategory, "checkUserPermissions").resolves(true);
      });
      it("should resolve true", async () => {
        const result = await User.hasPermissionToEditSubcategory(
          _id,
          fakeSubcategoryId
        );
        expect(result).to.be.true;
      });
    });
  });
  describe("hasPermissionToEditTransaction()", () => {
    const fakeTransactionId = 92735;
    let queryDbStub: SinonStub;
    describe("if database query returns a row...", () => {
      beforeEach(() => {
        queryDbStub = sinon
          .stub(Database, "queryDb")
          .resolves([{ transactionId: fakeTransactionId } as RowDataPacket]);
      });
      it("should query the database", async () => {
        await User.hasPermissionToEditTransaction(_id, fakeTransactionId);
        expect(queryDbStub.calledOnce).to.be.true;
        expect(
          queryDbStub.calledOnceWith(
            "users/hasPermissionToEditTransaction.sql",
            [_id, fakeTransactionId]
          )
        ).to.be.true;
      });
      it("should return true", async () => {
        const result = await User.hasPermissionToEditTransaction(
          _id,
          fakeTransactionId
        );
        expect(result).to.be.true;
      });
    });
    describe("if database query returns an empty set...", () => {
      beforeEach(() => {
        queryDbStub = sinon.stub(Database, "queryDb").resolves([]);
      });
      it("should query the database", async () => {
        await User.hasPermissionToEditTransaction(_id, fakeTransactionId);
        expect(queryDbStub.calledOnce).to.be.true;
        expect(
          queryDbStub.calledOnceWith(
            "users/hasPermissionToEditTransaction.sql",
            [_id, fakeTransactionId]
          )
        ).to.be.true;
      });
      it("should return false", async () => {
        const result = await User.hasPermissionToEditTransaction(
          _id,
          fakeTransactionId
        );
        expect(result).to.be.false;
      });
    });
  });
});
