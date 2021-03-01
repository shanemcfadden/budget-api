import sinon, { SinonStub } from "sinon";
import chai from "chai";
import chaiuuid from "chai-uuid";
import { RowDataPacket } from "mysql2";
import User from "../../src/models/user";
import * as Database from "../../src/database/Database";

chai.use(chaiuuid);
const expect = chai.expect;

const fakeUser = {
  _id: "asdfasdfa",
  email: "fake@email.com",
  password: "asdfasdf",
  firstName: "John",
  lastName: "Smith",
};

describe("User model", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("findByEmail()", () => {
    const email = "fake@email.com";
    describe("If user with email exists in the database...", () => {
      it("should return complete user object", async () => {
        sinon.stub(Database, "queryDb").resolves([fakeUser] as RowDataPacket[]);
        const result = await User.findByEmail(email);
        expect(result).to.deep.equal(fakeUser);
      });
    });
    describe("If email doesn't exist in the database...", () => {
      it("should return null", async () => {
        sinon.stub(Database, "queryDb").resolves([] as RowDataPacket[]);
        const result = await User.findByEmail(email);
        expect(result).to.be.null;
      });
    });
  });
  describe("create()", () => {
    let queryDbStub: SinonStub;
    beforeEach(() => {
      queryDbStub = sinon.stub(Database, "queryDb").resolves();
    });
    const fakeUserData = {
      ...fakeUser,
      _id: undefined,
    };
    it("should create a unique id for each user", async () => {
      const result = await User.create(fakeUserData);
      expect(result).to.have.property("_id");
      // @ts-ignore
      expect(result?._id).to.be.a.uuid("v4");
    });
    it("should create a user with a query", async () => {
      const { email, password, firstName, lastName } = fakeUserData;

      await User.create(fakeUserData);
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
      const result = await User.create(fakeUserData);
      expect(result).to.have.all.keys(["_id"]);
    });
  });
});
