DROP TABLE transactions;

DROP TABLE transaction_subcategories;

DROP TABLE transaction_categories;

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

CREATE TABLE budgets(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(240),
    PRIMARY KEY (id)
);

CREATE TABLE budget_users(
    budget_id INT UNSIGNED NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (budget_id, user_id)
);

CREATE TABLE accounts(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(240),
    start_date DATE NOT NULL,
    start_balance DECIMAL(10, 2) NOT NULL,
    budget_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);

CREATE TABLE transaction_categories (
    id INT UNSIGNED AUTO_INCREMENT,
    description VARCHAR(100) NOT NULL,
    is_income BOOLEAN NOT NULL,
    budget_id INT UNSIGNED NOT NULL,
    FOREIGN Key (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);

CREATE TABLE transaction_subcategories (
    id INT UNSIGNED AUTO_INCREMENT,
    description VARCHAR(100) NOT NULL,
    category_id INT UNSIGNED NOT NULL,
    FOREIGN Key (category_id) REFERENCES transaction_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);

CREATE TABLE transactions(
    id INT UNSIGNED AUTO_INCREMENT,
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(100),
    date DATE NOT NULL,
    account_id INT UNSIGNED NOT NULL,
    subcategory_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (subcategory_id) REFERENCES transaction_subcategories(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);
