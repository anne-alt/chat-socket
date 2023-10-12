const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import the User model

// Create a new user
router.post('/users', async (req, res) => {
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
router.get('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the user' });
  }
});

// Add more routes for updating and deleting users as needed

module.exports = router;
