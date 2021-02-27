import { expect } from "chai";

describe("login", () => {
  describe("If email and password are submitted...", () => {
    describe("If email and password are correct...", () => {
      it("should not throw an error");
      it("should return a JWT in the response");
    });
    describe("If email and password are incorrect...", () => {
      it("should throw an error");
    });
  });
  describe("If email is not submitted...", () => {
    it("should throw an error.");
  });
  describe("If password is not submitted...", () => {
    it("should throw an error.");
  });
});

describe("signup", () => {
  describe("if email is not a duplicate...", () => {
    it("should respond with a success");
    it("should return a JWT in the response");
  });
  describe("if email is a duplicate...", () => {
    it("should throw an error.");
  });
});
