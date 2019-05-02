DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL (10, 2),
    stock_quantity INT(10),
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Acoustic Guitar", "Music", 350.00, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("13in Macbook Pro", "Electronics", 1100.00, 7);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Garmin Fenix 5 GPS Watch", "Electronics", 350.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Taylormade M5 Driver", "Golf", 525.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Sage Fly Fishing Rod", "Outdoors", 800.00, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Simms Waders", "Outdoors", 250.00, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Wilson Football", "Sporting Goods", 19.99, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("10in Cast Iron Skillet", "Kitchen Supplies", 30.50, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Stainless Steel Toaster", "Kitchen Supplies", 33.75, 18);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Milwaukee 18V Cordless Drill", "Tools", 41.76, 9);

SELECT * FROM products;