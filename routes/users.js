const express = require('express');
const router = express.Router();
const User = require('../models/user'); 
const Order = require('../models/order');

// Create a new user
router.post('/new', async (req, res) => {
  const { email, category, username, password } = req.body;
  const user = new User( email, category, username, password);

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error creating the user' });
  }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user-specific orders
router.get('/orders/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const userOrders = await Order.findUserOrders(userId);
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user orders' });
  }
});


module.exports = router;
