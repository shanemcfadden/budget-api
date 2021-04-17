SELECT 
    IFNULL(SUM(amount),0) + a.start_balance AS 'currentBalance' 
FROM accounts AS a
    JOIN transactions AS t ON t.account_id = a.id 
    WHERE a.id = ?
    GROUP BY a.id
;