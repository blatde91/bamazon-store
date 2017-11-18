DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
    item_id INTEGER(10),
	product_name VARCHAR(60),
    department_name VARCHAR(60),
    price DECIMAL(10, 2),
    stock_quantity INTEGER(10)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
	VALUES(601, "Folding Knife", "Outdoors", 34.99, 15),
    (132, "Levi's Men's 510 Jeans", "Clothing", 36.98, 9),
    (215, "Dog Collar", "Pet Supplies", 10.03, 3),
    (372, "Radial Tire", "Automotive", 130.20, 4),
    (119, "Santa Socks", "Clothing", 3.01, 28),
    (515, "Kindle Fire 7", "Electronics", 49.99, 73),
    (227, "Exercise Wheel", "Pet Supplies", 17.99, 43),
    (419, "KiKi's Delivery Service", "Movies", 29.99, 112),
    (872, "Norwegian Wood", "Books", 9.99, 226),
    (966, "Super Mario Oddysey", "Games", 59.99, 15),
    (543, "Nintendo Switch", "Electronics", 299.99, 2);
    
    
    

SELECT * FROM products;
    