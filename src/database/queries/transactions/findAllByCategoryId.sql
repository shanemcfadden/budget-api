SELECT
    t.amount,
    t.description,
    t.date,
    t.account_id AS accountId,
    t.subcategory_id AS subcategoryId,
    t.id
FROM
    transactions AS t
    JOIN transaction_subcategories AS ts ON t.subcategory_id = ts.id
    JOIN transaction_categories AS tc ON tc.id = ts.category_id
WHERE
    tc.id = ?;