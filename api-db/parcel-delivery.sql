CREATE DATABASE IF NOT EXISTS parcel_delivery;
USE parcel_delivery;
CREATE TABLE deliveries (
    delivery_id VARCHAR(64) UNIQUE PRIMARY KEY,
    delivery_status INT NOT NULL DEFAULT 1 CHECK (delivery_status >= 0 AND delivery_status <= 3),
    service_level ENUM('Standard', 'Express') NOT NULL DEFAULT 'Standard',
    expected_delivery_date DATETIME NOT NULL,
    sender_address VARCHAR(255) NOT NULL,
    recipient_address VARCHAR(255) NOT NULL,
    delivered_at DATETIME DEFAULT NULL,
    version INT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    order_id VARCHAR(36) NOT NULL
);
CREATE TABLE delivery_tokens (
    delivery_token_id VARCHAR(36) NOT NULL PRIMARY KEY,
    delivery_token VARCHAR(125) NOT NULL UNIQUE,
    delivery_token_expiry DATETIME NOT NULL,
    delivery_id VARCHAR(64) UNIQUE,
    FOREIGN KEY (delivery_id) REFERENCES deliveries(delivery_id)
);
CREATE TABLE accounts (
    id INT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT "user",
    PRIMARY KEY (id)
);

-- SAMPLE USER
-- INSERT INTO accounts (full_name, username, email, password, role, session_cookie, session_expiry)
-- VALUES ('John Doe', 'johndoe', 'johndoe@example.com', 'hashedpassword', 1, 'dummysession', '2022-12-31 23:59:59');