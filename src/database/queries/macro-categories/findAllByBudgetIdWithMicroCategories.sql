SELECT  
    transaction_macro_categories.id AS id,
    transaction_macro_categories.description AS macroCategoryDescription,
    is_income AS isIncome,
    budget_id AS budgetId,
    transaction_micro_categories.id AS microCategoryId,
    transaction_micro_categories.description AS microCategoryDescription
FROM transaction_macro_categories 
    LEFT JOIN transaction_micro_categories ON transaction_micro_categories.macro_category_id = transaction_macro_categories.id 
    WHERE budget_id = ?
;