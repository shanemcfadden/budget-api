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

export interface BudgetAccountTransactionData extends BudgetData {
  accounts: Record<number, AccountDataWithoutBudgetId>;
  transactions: TransactionData[];
}

export interface CompleteBudgetData extends BudgetAccountTransactionData {
  microCategories: Record<number, NewMicroCategoryData>;
  macroCategories: Record<number, MacroCategoryDataWithoutBudgetId>;
}

export interface AccountDataBase {
  name: string;
  description?: string;
  startDate: Date;
  startBalance: number;
}
export interface NewAccountData extends AccountDataBase {
  budgetId: number;
}

export interface AccountDataWithoutBudgetId extends AccountDataBase {
  currentBalance: number;
}

export interface CoreAccountData extends NewAccountData {
  currentBalance: number;
}

export interface CompleteAccountData extends CoreAccountData {
  id: number;
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

export interface MacroCategoryDataWithoutBudgetId {
  description: string;
  isIncome: boolean;
}
export interface NewMacroCategoryData extends MacroCategoryDataWithoutBudgetId {
  budgetId: number;
}

export interface MacroCategoryData extends NewMacroCategoryData {
  id: number;
}

export interface NewMicroCategoryData {
  description: string;
  macroCategoryId: number;
}

export interface MicroCategoryData extends NewMicroCategoryData {
  id: number;
}