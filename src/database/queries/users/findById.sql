SELECT 
    email,
    first_name AS firstName,
    last_name AS lastName
FROM users
    WHERE _id = ? ;