SELECT 
    transactions.id, 
    amount, 
    transactions.id, 
    date, 
    account_id AS accountId, 
    category_id AS categoryId 
FROM transactions
    JOIN accounts ON transactions.account_id = accounts.id 
    WHERE accounts.budget_id = ?
;