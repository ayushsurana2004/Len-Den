-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    mobile_number VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- Groups Table (Optional for this MVP but provided for scalability)
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_by INTEGER REFERENCES users(id)
);

-- Expenses Table
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payer_id INTEGER REFERENCES users(id),
    group_id INTEGER REFERENCES groups(id),
    split_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expense Splits Table
CREATE TABLE expense_splits (
    id SERIAL PRIMARY KEY,
    expense_id INTEGER REFERENCES expenses(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL
);

-- Settlements Table (Secret Key Settlement)
CREATE TABLE settlements (
    id SERIAL PRIMARY KEY,
    payer_id INTEGER REFERENCES users(id),
    payee_id INTEGER REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    settlement_key VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- User Groups Mapping
CREATE TABLE user_groups (
    user_id INTEGER REFERENCES users(id),
    group_id INTEGER REFERENCES groups(id),
    settlement_key VARCHAR(12),
    PRIMARY KEY (user_id, group_id)
);
