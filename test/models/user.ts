import sinon from "sinon";
import { expect } from "chai";
import { RowDataPacket } from "mysql2";
import User from "../../src/models/user";
import * as Database from "../../src/database/Database";

const fakeUser = {
  _id: "asdfasdfa",
  email: "fake@email.com",
  password: "asdfasdf",
  firstName: "John",
  lastName: "Smith",
};

describe("User model", () => {
  beforeEach(() => {
    sinon.stub(Database, "queryDb").resolves([fakeUser] as RowDataPacket[]);
  });
  afterEach(() => {
    sinon.restore();
  });

  describe("findByEmail()", () => {
    const email = "fake@email.com";
    describe("If user with email exists in the database...", () => {
      it("should return complete user object", async () => {
        const result = await User.findByEmail(email);
        expect(result).to.deep.equal(fakeUser);
      });
    });
    describe("If email doesn't exist in the database...", () => {
      it("should return null");
    });
  });
  describe("create()", () => {
    it("should create a unique id for each user");
    it("should create a user with a query");
    it("should return an object with the user id");
  });
});
