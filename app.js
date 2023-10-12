const express = require('express');
require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const path = require('path');
const PORT = process.env.PORT || 3000;
const connectToDatabase = require('./database')
const jwt_secret = process.env.JWT_SECRET

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const User = require('./models/user')

// Set the views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use(express.json());

// Render the index page
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/signup', async (req, res) => {
  try {
    const { email, username, password, category} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User( email, username, hashedPassword, category);

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error(error); // Log the error for debugging
    let errorMessage = error.message;

    if (error.message.includes('Validation failed')) {
      errorMessage = 'Validation error. Please provide all required fields';
    }

    res.status(500).json({ message: errorMessage });
  }
});

app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (passwordIsValid) {

      // Create a JWT token
      const token = jwt.sign(
        {
          _id: user._id,
          email: user.email,
          category: user.category,
        },
        jwt_secret,
        { expiresIn: '1h' } // Token expires in 1 hour (adjust as needed)
      );

      res.status(200).json({ message: 'Login successful', 
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        accessToken: token,
      });

    } else {
      return res.status(401).json({ message: 'Invalid password.' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Order model and routes (order.js)
const orderRoutes = require('./routes/orders');
app.use('/orders', orderRoutes);

// WebSocket handling
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (message) => {
    io.emit('chat message', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

connectToDatabase()
    .then(() => {
      server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch(console.error);


