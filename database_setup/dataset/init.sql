-- Creating the user table
CREATE TABLE users (
    id SERIAL PRIMARY KEY ,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE,
    password VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);

-- Creating the role table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- Creating the users_roles table
CREATE TABLE users_roles (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Creating the category table
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- Creating the bug_status table
CREATE TABLE bug_status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

-- Creating the bug_report table
CREATE TABLE bug_report (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    priority VARCHAR(10),
    actual_bug_status_id INT REFERENCES bug_status(id),
    category_id INT REFERENCES category(id),
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creating the bug_report_log table
CREATE TABLE bug_report_log (
    id SERIAL PRIMARY KEY,
    bug_report_id INT REFERENCES bug_report(id) ON DELETE CASCADE,
    bug_status_id INT REFERENCES bug_status(id),
    comment VARCHAR(255),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creating the bug_assignment table
CREATE TABLE bug_assignment (
    id SERIAL PRIMARY KEY,
    bug_report_id INT REFERENCES bug_report(id) ON DELETE CASCADE,
    employee_id INT REFERENCES users(id)
);
