-- Create user-table
CREATE TABLE IF NOT EXISTS user_table (
    id BIGSERIAL PRIMARY KEY,
    date_created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    role VARCHAR(32) NOT NULL CHECK (role IN ('user', 'admin')),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_salt VARCHAR(32),
    password_hash VARCHAR(64),
    password_algo VARCHAR(32)
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create session-table
CREATE TABLE IF NOT EXISTS session_table (
    token VARCHAR(48) PRIMARY KEY NOT NULL,
    date_created TIMESTAMP NOT NULL DEFAULT NOW(),
    expiry_date TIMESTAMP NOT NULL,
    data JSONB,
    user_id INTEGER UNIQUE NOT NULL
);

-- Create login-attempt-table.

CREATE TABLE IF NOT EXISTS login_attempt (
	id SERIAL PRIMARY KEY,
	email VARCHAR(128) NOT NULL,
	attempt_date TIMESTAMP NOT NULL DEFAULT NOW(),
	ip_address VARCHAR(128) NOT NULL,
	user_agent VARCHAR(255),
	location VARCHAR(255),
	additional_info VARCHAR(255),
	is_successful BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS session__expiry_date__index ON session_table(expiry_date);
