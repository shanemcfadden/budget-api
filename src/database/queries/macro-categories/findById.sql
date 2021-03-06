SELECT 
    id,
    description,
    is_income AS isIncome,
    budget_id AS budgetId
FROM transaction_macro_categories
    WHERE id = ?
;