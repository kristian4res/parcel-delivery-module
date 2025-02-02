CREATE TABLE addresses (
    id INT NOT NULL AUTO_INCREMENT,
    account_id INT NOT NULL,
    address VARCHAR(100),
    city VARCHAR(50),
    post_code VARCHAR(10),
    country VARCHAR(50),

    PRIMARY KEY (id),
    FOREIGN KEY (account_id) references accounts(id)
)

INSERT INTO addresses (account_id, address, city, post_code, country) VALUES (2, '21 Baller Street', 'Bournemouth', 'SO14 3EP', 'United Kingdom')