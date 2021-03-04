import { expect } from "chai";
import { capitalize } from "../../src/util/strings";

describe("capitalize()", () => {
  it("should capitalize the first letter of a word", () => {
    [
      ["hello", "Hello"],
      ["john", "John"],
      ["a", "A"],
      ["", ""],
      ["superHero", "SuperHero"],
    ].forEach((val) => {
      expect(
        capitalize(val[0]),
        `capitalize(${val[0]}) does not equal ${val[1]}`
      ).to.equal(val[1]);
    });
  });
});
