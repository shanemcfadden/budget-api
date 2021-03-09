SELECT 
    accounts.id AS id,
    name, 
    accounts.description AS description,
    start_date AS startDate, 
    start_balance AS startBalance, 
    budget_id AS budgetId,
    IFNULL(SUM(amount),0) + start_balance AS 'currentBalance' 
FROM accounts
    JOIN transactions ON transactions.account_id = accounts.id 
    WHERE accounts.budget_id = ?
    GROUP BY accounts.id
;