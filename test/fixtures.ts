import { RowDataPacket } from "mysql2";
import {
  BudgetAccountData,
  BudgetData,
  CategoriesData,
  CompleteAccountData,
  CompleteBudgetData,
  MacroCategoryData,
  MicroCategoryData,
  TransactionData,
  UserData,
} from "../src/types/models";

export const fakeUser: UserData = {
  email: "fake@email.com",
  password: "passwordhash",
  _id: "fakeid123",
  firstName: "Jane",
  lastName: "Doe",
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

export const fakeMacroCategories: MacroCategoryData[] = [
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

export const fakeMicroCategories: MicroCategoryData[] = [
  {
    id: 300,
    description: "Bonuses",
    macroCategoryId: fakeMacroCategories[0].id,
  },
  {
    id: 345,
    description: "Food",
    macroCategoryId: fakeMacroCategories[1].id,
  },
];

export const fakeMacroMicroCategoryRows: RowDataPacket[] = [
  {
    id: fakeMacroCategories[0].id,
    macroCategoryDescription: fakeMacroCategories[0].description,
    isIncome: fakeMacroCategories[0].isIncome,
    budgetId: fakeMacroCategories[0].budgetId,
    microCategoryId: fakeMicroCategories[0].id,
    microCategoryDescription: fakeMicroCategories[0].description,
  } as RowDataPacket,
  {
    id: fakeMacroCategories[1].id,
    macroCategoryDescription: fakeMacroCategories[1].description,
    isIncome: fakeMacroCategories[1].isIncome,
    budgetId: fakeMacroCategories[1].budgetId,
    microCategoryId: fakeMicroCategories[1].id,
    microCategoryDescription: fakeMicroCategories[1].description,
  } as RowDataPacket,
];

export const fakeCategoriesData: CategoriesData = {
  [fakeMacroCategories[0].id]: {
    description: fakeMacroCategories[0].description,
    isIncome: fakeMacroCategories[0].isIncome,
    microCategories: {
      [fakeMicroCategories[0].id]: fakeMicroCategories[0].description,
    },
  },
  [fakeMacroCategories[1].id]: {
    description: fakeMacroCategories[1].description,
    isIncome: fakeMacroCategories[1].isIncome,
    microCategories: {
      [fakeMicroCategories[1].id]: fakeMicroCategories[1].description,
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
    categoryId: fakeMicroCategories[1].id,
  },
  {
    id: 2,
    amount: 300,
    description: "Paycheck",
    date: new Date("2021-01-14"),
    accountId: fakeAccounts[0].id,
    categoryId: fakeMicroCategories[0].id,
  },
  {
    id: 2,
    amount: -4.55,
    description: "Sandwich",
    date: new Date("2021-01-13"),
    accountId: fakeAccounts[1].id,
    categoryId: fakeMicroCategories[1].id,
  },
  {
    id: 2,
    amount: 500,
    description: "Gift from sofa cushions",
    date: new Date("2021-01-12"),
    accountId: fakeAccounts[1].id,
    categoryId: fakeMicroCategories[0].id,
  },
];

export const fakeCompleteBudgetData: CompleteBudgetData = {
  ...fakeBudgetAccountData,
  transactions: fakeTransactions,
  categories: fakeCategoriesData,
};
