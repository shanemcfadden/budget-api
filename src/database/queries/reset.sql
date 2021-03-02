DROP TABLE users;
DROP TABLE budgets;

CREATE TABLE users(
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    pw VARCHAR(100),
    first_name VARCHAR(100),
    last_name VARCHAR(100)
);

INSERT INTO users (id, email, pw, first_name, last_name)
    VALUES 
        ('1', 'test@test.com', '$2b$12$RKlftCLGSo0VkcpG0yqJfezbnHAbgsR8kXfsXQb2UrIws9A1MU1wq', 'Jane', 'Doe'), 
        ('2', 'test2@test.com', 'password', 'John', 'Smith'),
        ('3', 'test3@test.com', 'ThisisHashed', 'Franz', 'Liszt'),
        ('4', 'test4@test.com', 'moreHash', 'Amy', 'Beach')
;

CREATE TABLE budgets(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(240),
    PRIMARY KEY (id)
);