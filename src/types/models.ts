export interface UserDataBase {
  email: string;
  firstName: string;
  lastName: string;
}
export interface UserDataMinusPassword extends UserDataBase {
  _id: string;
}

export interface NewUserData extends UserDataBase {
  password: string;
}

export interface UserData extends NewUserData {
  _id: string;
}

export interface NewBudgetData {
  title?: string;
  description?: string;
}
export interface BudgetData extends NewBudgetData {
  id: number;
}

interface ExtensiveBudgetData extends BudgetData {
  accounts: Record<number, NewAccountData>;
  transactions: Record<number, NewTransactionData>;
}

export interface NewAccountData {
  name: string;
  description?: string;
  startDate: Date;
  startBalance: number;
  budgetId: number;
}
export interface AccountData extends NewAccountData {
  id: number;
  currentBalance: number;
}

export interface NewTransactionData {
  amount: number;
  description?: string;
  date: Date;
  accountId: number;
  categoryId: number;
}

export interface TransactionData extends NewTransactionData {
  id: number;
}

export interface NewMicroCategoryData {
  description: string;
  macroCategoryId: number;
}

export interface MicroCategoryData extends NewMicroCategoryData {
  id: number;
}
