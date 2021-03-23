import { expect } from "chai";
import fs from "fs/promises";
import { FieldPacket, RowDataPacket } from "mysql2";
import sinon, { SinonStub } from "sinon";
import * as Database from "database/Database";
import { ServerError } from "util/errors";

describe("Database functions", () => {
  let queryDbPoolStub: SinonStub;
  afterEach(() => {
    sinon.restore();
  });
  describe("queryDb()", () => {
    const mockQueryPath = "model/file.sql";
    const mockValues = ["1", "z", 4];
    describe("if queryPath points to a nonexistant file...", () => {
      beforeEach(() => {
        sinon.stub(fs, "readFile").rejects(new Error("readFile failed"));
        queryDbPoolStub = sinon
          .stub(Database.db, "query")
          .resolves([
            [{ mockData: "x" }] as RowDataPacket[],
            {} as FieldPacket[],
          ]);
      });
      it("should throw a ServerError", () => {
        return Database.queryDb(mockQueryPath, mockValues)
          .then(() => {
            throw new Error("queryDb() should reject");
          })
          .catch((err) => {
            expect(
              err instanceof ServerError,
              "Error not an instance of ServerError"
            ).to.be.true;
            expect(err.statusCode, "incorrect statusCode").to.equal(500);
            expect(err.message, "incorrect error message").to.equal(
              "Internal server error"
            );
          });
      });
      it("should not query db", () => {
        return Database.queryDb(mockQueryPath, mockValues)
          .then(() => {
            throw new Error("queryDb() should reject");
          })
          .catch(() => {})
          .finally(() => {
            expect(queryDbPoolStub.called).to.be.false;
          });
      });
    });
    describe("if queryPath points to an existing file", () => {
      beforeEach(() => {
        sinon.stub(fs, "readFile").resolves("SELECT * FROM table;");
      });
      describe("if query rejects...", () => {
        beforeEach(() => {
          sinon
            .stub(Database.db, "query")
            .rejects(new Error("queryDb did not succeed"));
        });
        it("should throw an error", () => {
          return Database.queryDb(mockQueryPath, mockValues)
            .then(() => {
              throw new Error("queryDb() should reject");
            })
            .catch((err) => {
              expect(
                err instanceof ServerError,
                "Error not an instance of ServerError"
              ).to.be.true;
              expect(err.statusCode, "incorrect statusCode").to.equal(500);
              expect(err.message, "incorrect error message").to.equal(
                "Internal server error"
              );
            });
        });
      });
      describe("if query resolves...", () => {
        const mockResults = [{ mockData: "x" }] as RowDataPacket[];
        beforeEach(() => {
          sinon
            .stub(Database.db, "query")
            .resolves([mockResults, {} as FieldPacket[]]);
        });
        it("should return results", async () => {
          const results = await Database.queryDb(mockQueryPath, mockValues);
          expect(results).to.deep.equal(mockResults);
        });
      });
    });
  });
});
