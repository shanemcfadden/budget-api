describe("isAuth middleware", () => {
  describe("if request has authorization header...", () => {
    describe("if JWT is valid...", () => {
      it("should attach isAuth=true to request object");
      it("should attach userId to request object");
      it("should call next at the end of the middleware");
    });
    describe("if JWT is expired", () => {
      it("should not attach isAuth to request object");
      it("should not attach userId to request object");
      it("should call next at the end of the middleware");
    });
    describe("if JWT is not valid...", () => {
      it("should not attach isAuth to request object");
      it("should not attach userId to request object");
      it("should call next at the end of the middleware");
    });
  });
  describe("if request does not have authorization header...", () => {
    it("should not attach isAuth to request object");
    it("should not attach userId to request object");
    it("should call next at the end of the middleware");
  });
});
