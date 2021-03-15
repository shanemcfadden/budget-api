import { RowDataPacket } from "mysql2";
import {
  BudgetAccountData,
  BudgetData,
  CategoriesData,
  CompleteAccountData,
  CompleteBudgetData,
  CategoryData,
  SubcategoryData,
  TransactionData,
  UserData,
  UserDataMinusPassword,
} from "../src/types/models";
import { ServerError } from "../src/util/errors";

export const fakeUserMinusPassword: UserDataMinusPassword = {
  email: "fake@email.com",
  _id: "fakeid123",
  firstName: "Jane",
  lastName: "Doe",
};

export const fakeUser: UserData = {
  ...fakeUserMinusPassword,
  password: "passwordhash",
};

export const mockJWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export const fakeBudgetData: BudgetData = {
  id: 34,
  title: "Fake budget",
  description: "This budget is for testing purposes",
};

export const fakeAccounts: CompleteAccountData[] = [
  {
    id: 22,
    name: "Fake checking",
    startBalance: 52,
    startDate: new Date("2021-01-01"),
    currentBalance: 200,
    budgetId: fakeBudgetData.id,
  },
  {
    id: 23,
    name: "Fake savings",
    startBalance: 1000,
    startDate: new Date("2020-01-01"),
    currentBalance: 20003,
    budgetId: fakeBudgetData.id,
  },
];

export const fakeBudgetAccountRows: RowDataPacket[] = [
  {
    budgetTitle: fakeBudgetData.title,
    budgetDescription: fakeBudgetData.description,
    accountId: fakeAccounts[0].id,
    accountName: fakeAccounts[0].name,
    accountDescription: fakeAccounts[0].description,
    startDate: fakeAccounts[0].startDate,
    startBalance: fakeAccounts[0].startBalance,
    currentBalance: fakeAccounts[0].currentBalance,
  } as RowDataPacket,
  {
    budgetTitle: fakeBudgetData.title,
    budgetDescription: fakeBudgetData.description,
    accountId: fakeAccounts[1].id,
    accountName: fakeAccounts[1].name,
    accountDescription: fakeAccounts[1].description,
    startDate: fakeAccounts[1].startDate,
    startBalance: fakeAccounts[1].startBalance,
    currentBalance: fakeAccounts[1].currentBalance,
  } as RowDataPacket,
];

export const fakeBudgetAccountData: BudgetAccountData = {
  ...fakeBudgetData,
  accounts: {
    [fakeAccounts[0].id]: {
      name: fakeAccounts[0].name,
      description: fakeAccounts[0].description,
      startBalance: fakeAccounts[0].startBalance,
      startDate: fakeAccounts[0].startDate,
      currentBalance: fakeAccounts[0].currentBalance,
    },
    [fakeAccounts[1].id]: {
      name: fakeAccounts[1].name,
      description: fakeAccounts[1].description,
      startBalance: fakeAccounts[1].startBalance,
      startDate: fakeAccounts[1].startDate,
      currentBalance: fakeAccounts[1].currentBalance,
    },
  },
};

export const fakeCategories: CategoryData[] = [
  {
    id: 45,
    description: "Work",
    isIncome: true,
    budgetId: fakeBudgetData.id,
  },
  {
    id: 50,
    description: "Personal",
    isIncome: false,
    budgetId: fakeBudgetData.id,
  },
];

export const fakeSubcategories: SubcategoryData[] = [
  {
    id: 300,
    description: "Bonuses",
    categoryId: fakeCategories[0].id,
  },
  {
    id: 345,
    description: "Food",
    categoryId: fakeCategories[1].id,
  },
];

export const fakeSubcategoryRows: RowDataPacket[] = [
  {
    id: fakeCategories[0].id,
    categoryDescription: fakeCategories[0].description,
    isIncome: fakeCategories[0].isIncome,
    budgetId: fakeCategories[0].budgetId,
    subcategoryId: fakeSubcategories[0].id,
    subcategoryDescription: fakeSubcategories[0].description,
  } as RowDataPacket,
  {
    id: fakeCategories[1].id,
    categoryDescription: fakeCategories[1].description,
    isIncome: fakeCategories[1].isIncome,
    budgetId: fakeCategories[1].budgetId,
    subcategoryId: fakeSubcategories[1].id,
    subcategoryDescription: fakeSubcategories[1].description,
  } as RowDataPacket,
];

export const fakeCategoriesData: CategoriesData = {
  [fakeCategories[0].id]: {
    description: fakeCategories[0].description,
    isIncome: fakeCategories[0].isIncome,
    subcategories: {
      [fakeSubcategories[0].id]: fakeSubcategories[0].description,
    },
  },
  [fakeCategories[1].id]: {
    description: fakeCategories[1].description,
    isIncome: fakeCategories[1].isIncome,
    subcategories: {
      [fakeSubcategories[1].id]: fakeSubcategories[1].description,
    },
  },
};

export const fakeTransactions: TransactionData[] = [
  {
    id: 2,
    amount: -3.55,
    description: "Coffee",
    date: new Date("2021-01-15"),
    accountId: fakeAccounts[0].id,
    categoryId: fakeSubcategories[1].id,
  },
  {
    id: 2,
    amount: 300,
    description: "Paycheck",
    date: new Date("2021-01-14"),
    accountId: fakeAccounts[0].id,
    categoryId: fakeSubcategories[0].id,
  },
  {
    id: 2,
    amount: -4.55,
    description: "Sandwich",
    date: new Date("2021-01-13"),
    accountId: fakeAccounts[1].id,
    categoryId: fakeSubcategories[1].id,
  },
  {
    id: 2,
    amount: 500,
    description: "Gift from sofa cushions",
    date: new Date("2021-01-12"),
    accountId: fakeAccounts[1].id,
    categoryId: fakeSubcategories[0].id,
  },
];

export const fakeCompleteBudgetData: CompleteBudgetData = {
  ...fakeBudgetAccountData,
  transactions: fakeTransactions,
  categories: fakeCategoriesData,
};

export const mockInternalServerError = new ServerError(
  500,
  "Mock internal server error"
);
