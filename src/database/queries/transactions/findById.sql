SELECT
    id,
    amount,
    description,
    date,
    account_id AS accountId,
    subcategory_id AS subcategory_id
FROM
    transactions
WHERE
    id = ?;