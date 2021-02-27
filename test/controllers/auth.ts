import { expect } from "chai";
import { NextFunction, Request, Response } from "express";
import sinon from "sinon";
import { login } from "../../src/controllers/auth";

describe("login", () => {
  describe("If email and password are correct...", () => {
    it("should not throw an error");
    it("should return a JWT in the response");
  });
  describe("If email and password are incorrect...", () => {
    it("should throw an error");
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
