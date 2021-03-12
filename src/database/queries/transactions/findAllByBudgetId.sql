SELECT 
    transactions.id, 
    amount, 
    transactions.description, 
    date, 
    account_id AS accountId, 
    category_id AS categoryId 
FROM transactions
    JOIN accounts ON transactions.account_id = accounts.id 
    WHERE accounts.budget_id = ?
    ORDER BY date DESC, description ASC
;