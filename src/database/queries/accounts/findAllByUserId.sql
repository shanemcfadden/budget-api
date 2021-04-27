SELECT
    accounts.id,
    accounts.name,
    accounts.description,
    start_date,
    start_balance,
    accounts.budget_id
from
    accounts
    JOIN budget_users ON budget_users.budget_id = accounts.budget_id
    JOIN users ON users.id = budget_users.user_id
WHERE
    users.id = ?;