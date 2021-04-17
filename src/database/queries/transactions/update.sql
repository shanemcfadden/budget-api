UPDATE
    transactions
SET
    amount = ?,
    description = ?,
    date = ?,
    account_id = ?,
    subcategory_id = ?
WHERE
    id = ?;