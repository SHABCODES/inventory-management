const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: 'inventory',
  host: 'db',
  database: 'inventory_system',
  password: 'inventory',
  port: 5432,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('✅ Connected to PostgreSQL database');
  release();
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Inventory API is running!' });
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, sku, description, category_id, price, cost, stock_quantity, min_stock_level } = req.body;
    
    const result = await pool.query(
      `INSERT INTO products (name, sku, description, category_id, price, cost, stock_quantity, min_stock_level) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, sku, description, category_id, price, cost, stock_quantity, min_stock_level]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, description, category_id, price, cost, stock_quantity, min_stock_level } = req.body;
    
    const result = await pool.query(
      `UPDATE products 
       SET name = $1, sku = $2, description = $3, category_id = $4, price = $5, cost = $6, stock_quantity = $7, min_stock_level = $8 
       WHERE id = $9 RETURNING *`,
      [name, sku, description, category_id, price, cost, stock_quantity, min_stock_level, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get low stock alerts
app.get('/api/alerts/low-stock', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE stock_quantity <= min_stock_level'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📊 API available at: http://localhost:${port}/api`);
});
