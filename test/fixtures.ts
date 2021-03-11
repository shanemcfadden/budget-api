import { RowDataPacket } from "mysql2";
import { BudgetData, CompleteAccountData, UserData } from "../src/types/models";

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

export const fakeBudgetAccountData = {
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
