CREATE TABLE deliveries (
    account_id INT NOT NULL,
    address_id INT NOT NULL,
    order_items LONGTEXT NOT NULL,
    order_total DECIMAL(10,2) NOT NULL,
    payment_type VARCHAR(20) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TINYINT(1) DEFAULT 0,
    dyn_link VARCHAR(100) NOT NULL,

    FOREIGN KEY (account_id) references accounts(id),
    FOREIGN KEY (address_id) references addresses(id)
);

INSERT INTO deliveries (account_id, address_id, order_items, order_total, payment_type, dyn_link) VALUES (?, ?, ?, ?, ?, ?)
