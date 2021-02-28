import "../../src/util/env";
import { expect } from "chai";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import sinon, { SinonSpy, SinonStub } from "sinon";
import bcrypt from "bcrypt";
import { login } from "../../src/controllers/auth";
import User from "../../src/models/user";

const { JWT_SECRET } = process.env;
interface MockResponse {
  status(code: number): MockResponse;
  json(object: Record<string, any>): void;
  statusCode?: number;
  body?: Record<string, any>;
}

const fakeUser = {
  email: "fake@email.com",
  password: "passwordhash",
  _id: "fakeid123",
  firstName: "Jane",
  lastName: "Doe",
};

describe("login", async () => {
  let req: Request;
  let res: MockResponse;
  let next: SinonSpy;

  beforeEach(async () => {
    req = {
      body: {
        email: "fake@email.com",
        password: "fakepassword",
      },
    } as Request;
    res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (object) {
        this.body = object;
        return;
      },
    };
    next = sinon.spy();
  });

  afterEach(async () => {
    sinon.restore();
  });

  describe("If email and password are correct...", async () => {
    const LOGIN_SUCCESS_MESSAGE = "Login successful";
    const mockJWT =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    let jwtSignStub: SinonStub;

    beforeEach(async () => {
      sinon.stub(User, "findByEmail").returns(fakeUser);
      sinon.stub(bcrypt, "compare").resolves(true);
      // jwt.sign() Types default to the asynchronous version, which returns void
      // Haven't found a way to get the stub to reference the synchronous sign method
      jwtSignStub = sinon
        .stub(jwt, "sign")
        .returns((mockJWT as unknown) as void);
    });

    it("should not throw an error", async () => {
      await login(req, res as Response, next as NextFunction);
      expect(next.called).to.be.false;
    });
    it("should set response status to 200", async () => {
      await login(req, res as Response, next as NextFunction);
      expect(res.statusCode).to.equal(200);
    });
    it("should send success message in res body", async () => {
      await login(req, res as Response, next as NextFunction);
      expect(res.body).to.have.property("message");
      expect(res.body?.message).to.equal(LOGIN_SUCCESS_MESSAGE);
    });
    it("should set a JWT with the user id that expires in 1 hour", async () => {
      await login(req, res as Response, next as NextFunction);
      expect(
        jwtSignStub.calledWith({ userId: fakeUser._id }, JWT_SECRET, {
          expiresIn: "1h",
        })
      ).to.be.true;
    });
    it("should return a JWT in the response", async () => {
      await login(req, res as Response, next as NextFunction);
      expect(res.body).to.have.property("token");
      expect(res.body?.token).to.equal(mockJWT);
    });
    it("should only have message and token in json body", async () => {
      await login(req, res as Response, next as NextFunction);
      expect(res.body).to.deep.equal({
        message: LOGIN_SUCCESS_MESSAGE,
        token: mockJWT,
      });
    });
  });
  describe("If email is incorrect...", async () => {
    it("should throw an error", async () => {
      sinon.stub(User, "findByEmail").returns(null);
      await login(req, res as Response, next as NextFunction);
      expect(next.calledOnce).to.be.true;
    });
    it("should not send a response", async () => {
      await login(req, res as Response, next as NextFunction);
      expect(res.statusCode).to.be.undefined;
      expect(res.body).to.be.undefined;
    });
  });
  describe("If password is incorrect...", async () => {
    beforeEach(async () => {
      sinon.stub(User, "findByEmail").returns(fakeUser);
      sinon.stub(bcrypt, "compare").resolves(false);
    });
    it("should throw an error", async () => {
      await login(req, res as Response, next as NextFunction);
      expect(next.calledOnce).to.be.true;
    });
    it("should not send a response", async () => {
      await login(req, res as Response, next as NextFunction);
      expect(res.statusCode).to.be.undefined;
      expect(res.body).to.be.undefined;
    });
  });
});

describe("signup", async () => {
  describe("if email is not a duplicate...", async () => {
    it("should respond with a success");
    it("should return a JWT in the response");
  });
  describe("if email is a duplicate...", async () => {
    it("should throw an error.");
  });
});
