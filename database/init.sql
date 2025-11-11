-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    price DECIMAL(10,2) DEFAULT 0,
    cost DECIMAL(10,2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory transactions table
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    transaction_type VARCHAR(20) NOT NULL,
    quantity INTEGER NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and components'),
('Office Supplies', 'Office stationery and supplies'),
('Furniture', 'Office furniture and equipment')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (sku, name, description, category_id, price, cost, stock_quantity, min_stock_level) VALUES
('LAP-001', 'Gaming Laptop', 'High-performance gaming laptop', 1, 1299.99, 900.00, 15, 3),
('MON-001', '27-inch Monitor', '4K UHD computer monitor', 1, 399.99, 250.00, 8, 2),
('DESK-001', 'Standing Desk', 'Adjustable height standing desk', 3, 499.99, 300.00, 5, 2),
('PEN-001', 'Ballpoint Pens', 'Pack of 12 ballpoint pens', 2, 12.99, 5.00, 50, 20),
('NOTE-001', 'Notebooks', 'Set of 5 premium notebooks', 2, 24.99, 12.00, 30, 10)
ON CONFLICT (sku) DO NOTHING;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_product ON inventory_transactions(product_id);
