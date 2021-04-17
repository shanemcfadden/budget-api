UPDATE transaction_categories
    SET description = ?, is_income = ? 
WHERE id = ?
;