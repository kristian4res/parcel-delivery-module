CREATE TABLE accounts (
    id INT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    permission_level INT NOT NULL,

    cookie VARCHAR(255),
    cookie_expiry DATETIME,

    PRIMARY KEY (id)
);

/****************************************************************
    * 
    *  INSERT INTO accounts
    * 
****************************************************************/