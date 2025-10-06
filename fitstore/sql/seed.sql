USE fitstoredb;

-- usuario admin
INSERT INTO users (email, password_hash, role)
VALUES ('admin@fitstore.com', '$2b$10$L8sSXtCHvYQHkQ6O2U0l0ezWlbkI/wrdGp0ST8y3LPRQmHLRf3nxe', 'admin');
-- password: admin123

-- cliente Eduardo Vargas
INSERT INTO users (email, password_hash, role)
VALUES ('cliente1@gmail.com', '$2b$10$L8sSXtCHvYQHkQ6O2U0l0ezWlbkI/wrdGp0ST8y3LPRQmHLRf3nxe', 'cliente');
-- misma password: admin123

INSERT INTO clients (user_id, company, first_name, last_name, phone, delivery_address)
VALUES (2, 'FitStoreAndComplements', 'Eduardo', 'Vargas', '600000001', 'c/rosello 1 08006 Barcelona');

-- productos disponibles
INSERT INTO products (name, price) VALUES
('Zapatos deportivos talla 45', 80.00),
('Pantalones deportivos', 50.00),
('Camiseta deportiva talla L', 30.00),
('Calcetines deportivos', 10.00);

-- Pedido 1: Zapatos + Pantalones
INSERT INTO orders (client_id, total, status)
VALUES (1, 130.00, 'Pedido recibido');
INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total)
VALUES
(1, 1, 1, 80.00, 80.00),
(1, 2, 1, 50.00, 50.00);

-- Pedido 2: Camiseta + Calcetines
INSERT INTO orders (client_id, total, status)
VALUES (1, 40.00, 'Pedido recibido');
INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total)
VALUES
(2, 3, 1, 30.00, 30.00),
(2, 4, 1, 10.00, 10.00);
