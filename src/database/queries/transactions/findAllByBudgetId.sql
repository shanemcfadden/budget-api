SELECT
    transactions.id,
    amount,
    transactions.description,
    date,
    account_id AS accountId,
    subcategory_id AS subcategoryId
FROM
    transactions
    JOIN accounts ON transactions.account_id = accounts.id
WHERE
    accounts.budget_id = ?
ORDER BY
    date DESC,
    description ASC;