import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE = 'http://localhost:5000/api'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category_id: 1,
    price: 0,
    cost: 0,
    stock_quantity: 0,
    min_stock_level: 5
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/products`)
      setProducts(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await axios.put(`${API_BASE}/products/${editingProduct.id}`, formData)
      } else {
        await axios.post(`${API_BASE}/products`, formData)
      }
      setShowForm(false)
      setEditingProduct(null)
      setFormData({
        name: '',
        sku: '',
        description: '',
        category_id: 1,
        price: 0,
        cost: 0,
        stock_quantity: 0,
        min_stock_level: 5
      })
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      category_id: product.category_id,
      price: product.price,
      cost: product.cost,
      stock_quantity: product.stock_quantity,
      min_stock_level: product.min_stock_level
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_BASE}/products/${id}`)
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const lowStockProducts = products.filter(p => p.stock_quantity <= p.min_stock_level)

  if (loading) {
    return <div className="loading">Loading inventory...</div>
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📦 Inventory Management System</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Add Product
        </button>
      </header>

      {lowStockProducts.length > 0 && (
        <div className="alert">
          <strong>Low Stock Alert:</strong> {lowStockProducts.length} product(s) need restocking
        </div>
      )}

      <div className="container">
        <div className="stats">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p>{products.length}</p>
          </div>
          <div className="stat-card">
            <h3>Low Stock</h3>
            <p className="warning">{lowStockProducts.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Value</h3>
            <p>${products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="products-section">
          <h2>Products</h2>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-header">
                  <h3>{product.name}</h3>
                  <span className={`stock-badge ${product.stock_quantity <= product.min_stock_level ? 'low' : 'adequate'}`}>
                    {product.stock_quantity} in stock
                  </span>
                </div>
                <p className="sku">SKU: {product.sku}</p>
                <p className="category">Category: {product.category_name}</p>
                <div className="product-details">
                  <div className="price">${product.price}</div>
                  <div className="cost">Cost: ${product.cost}</div>
                </div>
                <div className="product-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>SKU:</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Cost:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value)})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stock Quantity:</label>
                  <input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Min Stock Level:</label>
                  <input
                    type="number"
                    value={formData.min_stock_level}
                    onChange={(e) => setFormData({...formData, min_stock_level: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update' : 'Create'} Product
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false)
                    setEditingProduct(null)
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
