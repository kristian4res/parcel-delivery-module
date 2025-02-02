-- NB: Temporary schema for Parcel-Delivery, there should be a unified ORDERS schema that is shared by all services.
CREATE TABLE orders_v2 (
    order_id INT AUTO_INCREMENT PRIMARY KEY
    order_uuid VARCHAR(36) NOT NULL UNIQUE,
    order_details VARCHAR(255) DEFAULT ''
);

-- SAMPLE DATA