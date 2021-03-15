SELECT 
    id,
    description, 
    category_id AS categoryId
FROM transaction_subcategories
    WHERE id = ?
;