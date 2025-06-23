-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
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
INSERT INTO users (email, password, name) VALUES
('user1@test.com', 'password123', 'Adrien Poirier');

INSERT INTO products (name, description, price) VALUES
('MacBook Pro 14"', 'Ordinateur portable Apple avec puce M3', 2399.99),
('iPhone 15 Pro', 'Smartphone Apple dernière génération', 1229.99),
('AirPods Pro 2', 'Écouteurs sans fil avec réduction de bruit', 279.99),
('iPad Air', 'Tablette Apple 10.9 pouces', 789.99),
('Apple Watch Series 9', 'Montre connectée Apple', 449.99);

INSERT INTO orders (user_id, total) VALUES
(1, 1199.98);

INSERT INTO order_products (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 2399.99),
(1, 3, 1, 279.99);

