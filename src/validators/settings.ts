export const ACCOUNT_SETTINGS = {
  name: {
    max: 100,
  },
  description: {
    max: 240,
  },
  startBalance: {
    min: -99999999.99,
    max: 99999999.99,
  },
};

export const AUTH_SETTINGS = {
  email: {
    max: 100,
  },
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
  firstName: {
    min: 1,
    max: 100,
  },
  lastName: {
    min: 1,
    max: 100,
  },
};

export const BUDGET_SETTINGS = {
  title: {
    min: 1,
    max: 100,
  },
  description: {
    max: 240,
  },
};

export const CATEGORY_SETTINGS = {
  description: {
    min: 1,
    max: 100,
  },
};

export const SUBCATEGORY_SETTINGS = {
  description: {
    min: 1,
    max: 100,
  },
};
