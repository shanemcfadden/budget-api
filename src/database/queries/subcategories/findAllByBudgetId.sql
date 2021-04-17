SELECT
    tsc.id,
    tsc.description,
    category_id AS categoryId
FROM
    transaction_subcategories as tsc
    JOIN transaction_categories as tc ON tc.id = category_id
WHERE
    tc.budget_id = ?;