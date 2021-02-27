import { expect } from "chai";
import { NextFunction, Request, Response } from "express";
import sinon from "sinon";
import { login } from "../../src/controllers/auth";

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
    it("should throw an error.", () => {
      const req = {
        body: {
          password: "fakepassword",
        },
      } as Request;
      const res = {} as Response;
      const next = sinon.spy();
      login(req, res, next as NextFunction);
      expect(next.calledOnce).to.be.true;
    });
  });
  describe("If password is not submitted...", () => {
    it("should throw an error.", () => {
      const req = {
        body: {
          email: "test@email.com",
        },
      } as Request;
      const res = {} as Response;
      const next = sinon.spy();
      login(req, res, next as NextFunction);
      expect(next.calledOnce).to.be.true;
    });
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
