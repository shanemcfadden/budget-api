SELECT 
    id,
    description, 
    macro_category_id AS macroCategoryId
FROM transaction_micro_categories
    WHERE id = ?
;