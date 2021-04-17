SELECT
    tc.id AS id,
    tc.description AS categoryDescription,
    is_income AS isIncome,
    budget_id AS budgetId,
    tsc.id AS subcategoryId,
    tsc.description AS subcategoryDescription
FROM
    transaction_categories AS tc
    LEFT JOIN transaction_subcategories AS tsc ON tsc.category_id = tc.id
WHERE
    budget_id = ?;