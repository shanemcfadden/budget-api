DROP TABLE transactions;
DROP TABLE transaction_micro_categories;
DROP TABLE transaction_macro_categories;
DROP TABLE accounts;
DROP TABLE budget_users;
DROP TABLE users;
DROP TABLE budgets;

CREATE TABLE users(
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    pw VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL
);

INSERT INTO users (id, email, pw, first_name, last_name)
    VALUES 
        ('1', 'test@test.com', '$2b$12$vSgxenb.N/h1amtlwhRZKOxzWQUTO4AV9ie1iaMg11MQQhDYZ4uTu', 'Jane', 'Doe'), 
        ('2', 'test2@test.com', 'password', 'John', 'Smith'),
        ('3', 'test3@test.com', 'ThisisHashed', 'Franz', 'Liszt'),
        ('4', 'test4@test.com', 'moreHash', 'Amy', 'Beach'),
        ('5', 'renegade@whitehouse.gov', '$2b$12$vSgxenb.N/h1amtlwhRZKOxzWQUTO4AV9ie1iaMg11MQQhDYZ4uTu', 'Barack', 'Obama'),
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
    start_date DATE NOT NULL,
    start_balance DECIMAL(10, 2) NOT NULL,
    budget_id INT NOT NULL,
    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);

INSERT INTO accounts (budget_id, name, description, start_date, start_balance) 
    VALUES
        (1, 'Vaca Savings', 'Chase bank, 1.1%APY', '2015-01-31', '500'),
        (2, 'Retirement', 'Vanguard Mutual Fund', '2009-1-20', '100000'),
        (2, 'Checking', 'The Federal Reserve', '2013-1-20', '49000.76'),
        (3, 'Chase Saphire Reserve', 'Chase bank, 21.99%APY', '2015-01-31', '-872.61'),
        (3, 'Business Checking', 'Wells Fargo', '2014-12-02', '60'),
        (2, 'Savings', 'The Federal Reserve', '2013-1-20', '100000')
;

CREATE TABLE transaction_macro_categories (
    id INT AUTO_INCREMENT,
    description VARCHAR(100) NOT NULL,
    is_income BOOLEAN NOT NULL,
    budget_id INT NOT NULL,
    FOREIGN Key (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
)
;

INSERT INTO transaction_macro_categories (description, is_income, budget_id)
    VALUES
        ('Work', 1, 1),
        ('Miscellaneous', 1, 1),
        ('Personal', 0, 1),
        ('Work', 1, 2),
        ('Personal', 0, 2),
        ('Freelance Work', 1, 2)
;

CREATE TABLE transaction_micro_categories (
    id INT AUTO_INCREMENT,
    description VARCHAR(100) NOT NULL,
    macro_category_id INT NOT NULL,
    FOREIGN Key (macro_category_id) REFERENCES transaction_macro_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
)
;

INSERT INTO transaction_micro_categories (description, macro_category_id)
    VALUES
        ('Full Time Job', 1),
        ('Other', 2),
        ('Travel', 3),
        ('White house income', 4),
        ('Malia and Sasha', 5),
        ('Food', 5)
;

CREATE TABLE transactions(
    id INT AUTO_INCREMENT,
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(100),
    date DATE NOT NULL,
    account_id INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES transaction_micro_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
)
;

INSERT INTO transactions (amount, description, date, account_id, category_id) 
    VALUES
        (300.50, 'Christmas bonus', '2020-12-25', 1, 1),
        (40, 'Found in coat pocket', '2021-01-02', 1, 2),
        (-334.99, 'Flight (Found on flash sale!)', '2021-01-15', 1, 3),
        (525000, 'Lumpsum of salary', '2010-1-1', 2, 4),
        (535000, 'Lumpsum of salary', '2011-1-1', 2, 4),
        (545000, 'Lumpsum of salary', '2012-1-1', 2, 4),
        (-20000, "Malia's tuition", '2016-1-3', 3, 5)
;
