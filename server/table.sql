CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contactNumber VARCHAR(15),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status BOOLEAN DEFAULT FALSE,
    role ENUM('user', 'admin') DEFAULT 'user'
);


insert into user(name, contactNumber, email, password, status, role) values('Admin', '1234567890', 'admin@gmail.com', 'admin', 1, 'admin');

CREATE TABLE product (
    id INT  not NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

create table item(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    itemId INT,
    description VARCHAR(255),
    price integer,
    status VARCHAR(20)
);

create table bill(
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    contactNumber VARCHAR(20) NOT NULL,
    paymentMethod varchar(50) NOT NULL,
    total INT NOT NULL,
    productDetails JSON DEFAULT NULL,
    createBy VARCHAR(255) NOT NULL
);