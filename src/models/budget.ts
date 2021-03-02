interface BudgetData {
  id: number;
  title?: string;
  description?: string;
}

class Budget {
  static findById(budgetId: number) {}

  static findAllByUserID(userId: string) {}
}

export default Budget;
