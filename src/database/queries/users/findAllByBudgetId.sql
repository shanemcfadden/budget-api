SELECT 
    u.id AS _id,
    email,
    first_name AS firstName,
    last_name AS lastName
FROM users AS u
    JOIN budget_users ON budget_users.user_id = u.id
    WHERE budget_users.budget_id = ?
;