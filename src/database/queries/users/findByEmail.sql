SELECT 
    id AS _id, 
    email, 
    pw AS password, 
    first_name AS firstName, 
    last_name AS lastName
  FROM users
  WHERE email = ?;