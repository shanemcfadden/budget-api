SELECT
    t.id AS transactionId,
    t.amount AS transactionAmount,
    t.description AS transactionDescription,
    t.date AS transactionDate,
    t.account_id AS transactionAccountId,
    t.category_id AS transactionCategoryId,
    b.id AS budgetId,
    b.title AS budgetTitle,
    b.description AS budgetDescription,
    a.name AS accountName,
    a.start_date AS accountStartDate,
    a.start_balance AS accountStartBalance
FROM transactions AS t
    RIGHT JOIN accounts AS a ON a.id = t.account_id
    JOIN budgets AS b ON b.id = a.budget_id
WHERE b.id = ?
;