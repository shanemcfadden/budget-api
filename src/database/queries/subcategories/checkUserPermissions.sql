SELECT
    sc.id
FROM
    transaction_subcategories AS sc
    JOIN transaction_categories AS c ON sc.category_id = c.id
    JOIN budget_users AS bu ON bu.budget_id = c.budget_id
    JOIN users AS u ON u.id = bu.user_id
WHERE
    sc.id = ?
    AND u.id = ?;