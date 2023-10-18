const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Create a new order
router.post('/new', async (req, res) => {
  const { buyerId, products, buyerName, productName } = req.body;
  const order = new Order(buyerId, products, buyerName, productName);

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get an order by ID
router.get('/:id', async (req, res) => {
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

// Update an order
router.put('/:id', async (req, res) => {
  const orderId = req.params.id;
  const updatedData = req.body;

  try {
    const result = await Order.updateOrder(orderId, updatedData);
    if (result) {
      res.status(200).json({ message: 'Order updated successfully' });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating the order' });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  const orderId = req.params.id;

  try {
    const result = await Order.deleteOrder(orderId);
    if (result) {
      res.status(200).json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the order' });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const allOrders = await Order.findAllOrders();
    res.status(200).json(allOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
