-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table de liaison commande-produits
CREATE TABLE IF NOT EXISTS order_products (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Données de test
INSERT INTO users (email, password, name, firstname, lastname, address, phone) VALUES
('user1@test.com', 'password123', 'Adrien', 'Adrien', 'Poirier', '123 Rue à Nantes, 44000 Nantes', '0612345678');

INSERT INTO products (name, description, price) VALUES
('MacBook Pro M4', 'Ordinateur portable Apple avec puce M4', 2399.99),
('iPhone 16', 'Smartphone Apple', 999.99),
('AirPods Pro', 'Écouteurs sans fil', 279.99),
('iPad Pro', 'Tablette Apple', 789.99),
('Apple Watch Series', 'Montre connectée Apple', 449.99);

INSERT INTO orders (user_id, total) VALUES
(1, 1199.98);

INSERT INTO order_products (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 2399.99),
(1, 3, 1, 279.99);

