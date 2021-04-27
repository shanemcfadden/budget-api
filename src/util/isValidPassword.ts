import { CustomValidator } from "express-validator";
import { AUTH_SETTINGS } from "validators/settings";

export default (
  errorMessage: string | undefined = undefined
): CustomValidator => {
  return (value: string) => {
    // const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    const validPassword = AUTH_SETTINGS.password;
    if (value.match(validPassword)) {
      return true;
    }
    throw new Error(errorMessage);
  };
};
