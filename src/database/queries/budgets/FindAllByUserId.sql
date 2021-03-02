SELECT budgets.id, title, description FROM budgets
    JOIN budget_users ON budget_users.budget_id = budgets.id 
    JOIN users ON budget_users.user_id = users.id 
WHERE users.id = ?
;