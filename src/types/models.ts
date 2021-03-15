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

export interface BudgetAccountData extends BudgetData {
  accounts: Record<number, AccountDataWithoutBudgetId>;
}

// TODO: Make the following type irrelevant
export interface CompleteBudgetData extends BudgetData {
  transactions: TransactionData[];
  categories: CategoriesData;
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

export interface UpdateAccountData extends AccountDataBase {
  id: number;
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

export interface CategoriesData {
  [index: number]: {
    description: string;
    isIncome: boolean;
    subcategories: Record<number, string>;
  };
}

export interface CategoryDataWithoutBudgetId {
  description: string;
  isIncome: boolean;
}
export interface NewCategoryData extends CategoryDataWithoutBudgetId {
  budgetId: number;
}

export interface CategoryData extends NewCategoryData {
  id: number;
}

export interface NewSubcategoryData {
  description: string;
  categoryId: number;
}

export interface SubcategoryData extends NewSubcategoryData {
  id: number;
}
