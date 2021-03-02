DROP TABLE budget_users;
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
        ('4', 'test4@test.com', 'moreHash', 'Amy', 'Beach'),
        ('5', 'renegade@whitehouse.gov', 'secretpw', 'Barack', 'Obama'),
        ('6', 'renaissance@whitehouse.gov', 'evenMOREsecretpw', 'Michelle', 'Obama')
;

CREATE TABLE budgets(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(240),
    PRIMARY KEY (id)
);

INSERT INTO budgets (title, description)
    VALUES
        ('Vacation', 'Not Cancun'),
        ('The Obama household', 'Yes we still budget'),
        ('My new startup', "We'll be profitable next month, I swear")
;

CREATE TABLE budget_users(
    budget_id INT NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (budget_id, user_id)
);

INSERT INTO budget_users (budget_id, user_id)
    VALUES
        (2, '5'),
        (2, '6'),
        (1, '3'),
        (3, '4')
;

CREATE TABLE accounts(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(240),
    start_date TIMESTAMP NOT NULL,
    start_balance DECIMAL(10, 2) NOT NULL,
    budget_id INT NOT NULL,
    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);