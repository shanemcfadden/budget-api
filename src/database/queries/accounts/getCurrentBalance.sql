SELECT
    IFNULL(SUM(t.amount), 0) + a.start_balance AS 'currentBalance'
FROM
    accounts AS a
    LEFT JOIN transactions AS t ON t.account_id = a.id
WHERE
    a.id = ?
GROUP BY
    a.id;