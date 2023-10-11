const express = require('express');
const router = express.Router();
const Order = require('../models/order'); // Import the Order model

// Create a new order
router.post('/orders', async (req, res) => {
  const { buyerId, sellerId, products } = req.body;
  const order = new Order(buyerId, sellerId, products);

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Error creating the order' });
  }
});

// Get an order by ID
router.get('/orders/:id', async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findOrderById(orderId);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the order' });
  }
});

// Add more routes for updating and deleting orders as needed

module.exports = router;
