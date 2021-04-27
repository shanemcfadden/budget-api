export const ACCOUNT_SETTINGS = {
  name: maxSetting(100),
  description: maxSetting(240),
  startBalance: minMaxSetting(-99999999.99, 99999999.99),
};

export const AUTH_SETTINGS = {
  email: maxSetting(100),
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
  firstName: minMaxSetting(1, 100),
  lastName: minMaxSetting(1, 100),
};

export const BUDGET_SETTINGS = {
  title: minMaxSetting(1, 100),
  description: maxSetting(240),
};

export const CATEGORY_SETTINGS = {
  description: minMaxSetting(1, 100),
};

export const SUBCATEGORY_SETTINGS = {
  description: minMaxSetting(1, 100),
};

export const TRANSACTION_SETTINGS = {
  description: maxSetting(100),
  amount: minMaxSetting(-99999999.99, 9999999.99),
};

interface MaxSettingObject {
  max: number;
}

interface MinMaxSettingObject extends MaxSettingObject {
  min: number;
}

function maxSetting(maxNum: number): MaxSettingObject {
  return { max: maxNum };
}

function minMaxSetting(minNum: number, maxNum: number): MinMaxSettingObject {
  const o = maxSetting(maxNum) as MinMaxSettingObject;
  o.min = minNum;
  return o;
}
