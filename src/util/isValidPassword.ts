import { CustomValidator } from "express-validator";

export default (
  errorMessage: string | undefined = undefined
): CustomValidator => {
  return (value: string) => {
    const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    if (value.match(validPassword)) {
      return true;
    }
    throw new Error(errorMessage);
  };
};
