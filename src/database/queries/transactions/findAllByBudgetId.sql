SELECT * FROM transactions
    JOIN accounts ON transactions.account_id = accounts.id 
    WHERE accounts.budget_id = ?
;