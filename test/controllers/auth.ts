import "../../src/util/env";
import { expect } from "chai";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import sinon, { SinonStub } from "sinon";
import bcrypt from "bcrypt";
import { MockResponse } from "../types";
import { fakeUser, mockJWT, mockInternalServerError } from "../fixtures";
import { AuthControllerBase } from "../../src/controllers/auth";
import User from "../../src/models/user";
import * as Errors from "../../src/util/errors";
import { ExtendedRequestHandler } from "../../src/types/express";

const { JWT_SECRET } = process.env;
const login = AuthControllerBase.login as ExtendedRequestHandler;
const signup = AuthControllerBase.signup as ExtendedRequestHandler;

let req: Request;
let res: MockResponse;
const next = (() => {}) as NextFunction;

describe("Auth Controller", () => {
  beforeEach(() => {
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
  });
  afterEach(async () => {
    sinon.restore();
  });

  describe("login", () => {
    beforeEach(() => {
      req = {
        body: {
          email: fakeUser.email,
          password: "fakepassword",
        },
      } as Request;
    });

    describe("if findByEmail throws an error...", () => {
      beforeEach(() => {
        sinon.stub(User, "findByEmail").rejects(mockInternalServerError);
      });
      it("should throw the error rejected by findByEmail()", async () => {
        try {
          await login(req, res as Response, next);
          throw new Error("login should throw an error");
        } catch (err) {
          expect(err).to.deep.equal(mockInternalServerError);
        }
      });
      it("should not send a response", async () => {
        try {
          await login(req, res as Response, next);
        } catch {
        } finally {
          expect(res.statusCode).to.be.undefined;
          expect(res.body).to.be.undefined;
        }
      });
    });
    describe("if findByEmail does not throw an error...", () => {
      describe("If email and password are correct...", async () => {
        const LOGIN_SUCCESS_MESSAGE = "Login successful";
        let jwtSignStub: SinonStub;

        beforeEach(() => {
          sinon.stub(User, "findByEmail").resolves(fakeUser);
          sinon.stub(bcrypt, "compare").resolves(true);
          // jwt.sign() Types default to the asynchronous version, which returns void
          // Haven't found a way to get the stub to reference the synchronous sign method
          jwtSignStub = sinon
            .stub(jwt, "sign")
            .returns((mockJWT as unknown) as void);
        });
        it("should not throw an error", async () => {
          await login(req, res as Response, next);
        });
        it("should set response status to 200", async () => {
          await login(req, res as Response, next);
          expect(res.statusCode).to.equal(200);
        });
        it("should send success message in res body", async () => {
          await login(req, res as Response, next);
          expect(res.body).to.have.property("message");
          expect(res.body?.message).to.equal(LOGIN_SUCCESS_MESSAGE);
        });
        it("should set a JWT with the user id that expires in 1 hour", async () => {
          await login(req, res as Response, next);
          expect(
            jwtSignStub.calledWith({ userId: fakeUser._id }, JWT_SECRET, {
              expiresIn: "1h",
            })
          ).to.be.true;
        });
        it("should return a JWT in the response", async () => {
          await login(req, res as Response, next);
          expect(res.body).to.have.property("token");
          expect(res.body?.token).to.equal(mockJWT);
        });
        it("should only have message and token in json body", async () => {
          await login(req, res as Response, next);
          expect(res.body).to.deep.equal({
            message: LOGIN_SUCCESS_MESSAGE,
            token: mockJWT,
          });
        });
      });
      describe("If email is incorrect...", async () => {
        beforeEach(() => {
          sinon.stub(User, "findByEmail").resolves(null);
        });
        it('should throw a 404 "User not found" error', async () => {
          try {
            await login(req, res as Response, next);
            throw new Error("login should reject");
          } catch (err) {
            expect(err).to.deep.equal(
              new Errors.ServerError(404, "User not found")
            );
          }
        });
        it("should not send a response", async () => {
          try {
            await login(req, res as Response, next);
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
      describe("If password is incorrect...", () => {
        beforeEach(() => {
          sinon.stub(User, "findByEmail").resolves(fakeUser);
          sinon.stub(bcrypt, "compare").resolves(false);
        });
        it('should throw a 401 "Authentication failed" error', async () => {
          try {
            await login(req, res as Response, next);
            throw new Error("login should reject");
          } catch (err) {
            expect(err).to.deep.equal(
              new Errors.ServerError(401, "Authentification failed")
            );
          }
        });
        it("should not send a response", async () => {
          try {
            await login(req, res as Response, next);
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
    });
  });

  describe("signup", async () => {
    beforeEach(() => {
      req = {
        body: {
          ...fakeUser,
          _id: undefined,
          password: "fakepassword",
        },
      } as Request;
    });
    describe("if findByEmail throws an error...", () => {
      beforeEach(() => {
        sinon.stub(User, "findByEmail").rejects(mockInternalServerError);
      });
      it("should throw the error rejected by findByEmail()", async () => {
        try {
          await signup(req, res as Response, next);
          throw new Error("signup should reject");
        } catch (err) {
          expect(err).to.deep.equal(mockInternalServerError);
        }
      });
      it("should not send a response", async () => {
        try {
          await signup(req, res as Response, next);
        } catch {
        } finally {
          expect(res.statusCode).to.be.undefined;
          expect(res.body).to.be.undefined;
        }
      });
    });
    describe("if findByEmail does not throw an error...", () => {
      describe("if email is not a duplicate...", async () => {
        const SIGNUP_SUCCESS_MESSAGE = "Sign up successful";
        let jwtSignStub: SinonStub;
        let createUserStub: SinonStub;

        beforeEach(() => {
          sinon.stub(User, "findByEmail").resolves(null);
          createUserStub = sinon
            .stub(User, "create")
            .resolves({ _id: fakeUser._id });
          sinon.stub(bcrypt, "hash").resolves(fakeUser.password);
          // jwt.sign() Types default to the asynchronous version, which returns void
          // Haven't found a way to get the stub to reference the synchronous sign method
          jwtSignStub = sinon
            .stub(jwt, "sign")
            .returns((mockJWT as unknown) as void);
        });
        it("should not throw an error", async () => {
          await signup(req, res as Response, next);
        });
        it("should create a user", async () => {
          const { email, firstName, lastName, password } = fakeUser;
          await signup(req, res as Response, next);
          expect(createUserStub.calledOnce).to.be.true;
          expect(
            createUserStub.calledWith({ email, firstName, lastName, password })
          ).to.be.true;
        });
        it("should set response status to 201", async () => {
          await signup(req, res as Response, next);
          expect(res.statusCode).to.equal(201);
        });
        it("should send success message in res body", async () => {
          await signup(req, res as Response, next);
          expect(res.body).to.have.property("message");
          expect(res.body?.message).to.equal(SIGNUP_SUCCESS_MESSAGE);
        });
        it("should set a JWT with the user id that expires in 1 hour", async () => {
          await signup(req, res as Response, next);
          expect(
            jwtSignStub.calledWith({ userId: fakeUser._id }, JWT_SECRET, {
              expiresIn: "1h",
            })
          ).to.be.true;
        });
        it("should return a JWT in the response", async () => {
          await signup(req, res as Response, next);
          expect(res.body).to.have.property("token");
          expect(res.body?.token).to.equal(mockJWT);
        });
      });
      describe("if email is a duplicate...", async () => {
        beforeEach(() => {
          sinon.stub(User, "findByEmail").resolves(fakeUser);
        });
        it('should throw a 401 "Account already associated with this email" error', async () => {
          try {
            await signup(req, res as Response, next);
            throw new Error("signup should throw an error");
          } catch (err) {
            expect(err).to.deep.equal(
              new Errors.ServerError(
                401,
                "Account already associated with this email"
              )
            );
          }
        });
        it("should not return a response", async () => {
          try {
            await signup(req, res as Response, next);
          } catch {
          } finally {
            expect(res.statusCode).to.be.undefined;
            expect(res.body).to.be.undefined;
          }
        });
      });
    });
  });
});
