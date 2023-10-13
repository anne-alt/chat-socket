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
const fetchUserOrder = require('./fetchUserOrder')
const { ObjectId } = require('mongodb')
const jwt_secret = process.env.JWT_SECRET

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const User = require('./models/user')
const Order = require('./models/order')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
  origin: 'http://localhost:3001', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// app.use(cors())

app.use(express.json());

// Render the index page
app.get('/landing', (req, res) => {
  res.render('index');
});

// Render the sign-up page
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Render the sign-in page
app.get('/signin', (req, res) => {
  res.render('signin');
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
    console.error(error); 
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

      const token = jwt.sign(
        {
          _id: user._id,
          email: user.email,
          category: user.category,
        },
        jwt_secret,
        { expiresIn: '1h' } // Token expires in 1 hour 
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

const orderRoutes = require('./routes/orders');
app.use('/orders', orderRoutes);

const userRoutes = require('./routes/users')
app.use('/users', userRoutes)

// WebSocket handling
io.on('connection', async (socket) => {
  try {
    console.log('A user connected');

    const userId = socket.request.session.userId; 

    const userOrder = await fetchUserOrder(userId); // Fetch the user's orders

    if (userOrder.length === 0) {
      socket.emit('notification', 'You have no running orders.');
    } else {
      userOrder.forEach(async (order) => {
        const orderConfirmationStatus = order.confirmed;

        // Emit an order confirmation notification based on the status
        if (!orderConfirmationStatus) {
          socket.emit('notification', 'Your order is pending.');
        } else {
          socket.emit('notification', 'Your order has been confirmed.');
        }
      });
    }
  } catch (error) {
    console.error('Error in WebSocket connection:', error);
  }

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


