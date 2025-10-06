DROP DATABASE IF EXISTS fitstoredb;
CREATE DATABASE fitstoredb CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE fitstoredb;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','cliente') DEFAULT 'cliente'
);

CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  company VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  delivery_address VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  price DECIMAL(10,2)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT,
  total DECIMAL(10,2),
  status ENUM('Pedido recibido','En proceso','Terminado','Entregado') DEFAULT 'Pedido recibido',
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  unit_price DECIMAL(10,2),
  line_total DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
