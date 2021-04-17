SELECT
    a.id AS accountId,
    name AS accountName,
    a.description AS accountDescription,
    start_date AS startDate,
    start_balance AS startBalance,
    IFNULL(SUM(amount), 0) + start_balance AS 'currentBalance',
    budget_id AS budgetId,
    b.title AS budgetTitle,
    b.description AS budgetDescription
FROM
    accounts AS a
    LEFT JOIN transactions ON transactions.account_id = a.id
    RIGHT JOIN budgets AS b ON b.id = a.budget_id
WHERE
    b.id = ?
GROUP BY
    a.id;