const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Import the Product model

// Create a new product
router.post('/products', async (req, res) => {
  const { name, description, price, sellerId } = req.body;
  const product = new Product(name, description, price, sellerId);

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error creating the product' });
  }
});

// Get a product by ID
router.get('/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the product' });
  }
});

// Add more routes for updating and deleting products as needed

module.exports = router;
