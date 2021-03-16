SELECT 
    c.id 
FROM transaction_categories AS c
    JOIN budget_users AS bu ON bu.budget_id = c.budget_id
    JOIN users AS u ON u.id = bu.user_id
WHERE
    c.id = ?
    AND
    u.id = ?
;