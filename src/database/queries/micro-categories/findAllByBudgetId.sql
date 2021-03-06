SELECT 
    transaction_micro_categories.id,
    transaction_micro_categories.description, 
    macro_category_id AS macroCategoryId
FROM transaction_micro_categories
    JOIN transaction_macro_categories ON transaction_macro_categories.id = macro_category_id
    WHERE transaction_macro_categories.budget_id = ?
;