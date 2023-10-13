const { ObjectId } = require('mongodb');
const connectToDatabase = require('./database');
const Order = require('./models/order');

async function fetchUserOrder(userId) {
  try {
    const db = await connectToDatabase();
    const ordersCollection = db.collection('orders');

    const userOrders = await ordersCollection.find({ buyerId: ObjectId(userId) }).toArray();

    return userOrders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}

module.exports = fetchUserOrder;
