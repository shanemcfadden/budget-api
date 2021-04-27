SELECT
    t.id AS transactionId
FROM
    transactions AS t
    JOIN accounts AS a ON t.account_id = a.id
    JOIN budget_users AS bu ON bu.budget_id = a.budget_id
WHERE
    bu.user_id = ?
    AND t.id = ?;