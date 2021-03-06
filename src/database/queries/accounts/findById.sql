SELECT 
    name, 
    accounts.description AS description,
    start_date AS startDate, 
    start_balance AS startBalance, 
    IFNULL(SUM(amount),0) + start_balance AS 'currentBalance' 
FROM accounts
    JOIN transactions ON transactions.account_id = accounts.id 
    WHERE accounts.id = ?
    GROUP BY accounts.id
;