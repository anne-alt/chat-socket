const { ObjectID } = require('mongodb');
const connectToDatabase = require('../database');

class Order {
  constructor(buyerId, sellerId, products) {
    this.buyerId = new ObjectID(buyerId); // This references the user _id
    this.sellerId = new ObjectID(sellerId); // This references the user _id
    this.products = products.map((product) => ({
      productId: new ObjectID(product.productId),
      quantity: product.quantity,
    }));
    this.orderDate = new Date();
    this.confirmed = false;
    // Add more fields as needed
  }

  async save() {
    const db = await connectToDatabase();
    const orders = db.collection('orders');

    const result = await orders.insertOne(this);

    return result.ops[0];
  }

  static async findOrderById(orderId) {
    const db = await connectToDatabase();
    const orders = db.collection('orders');

    const order = await orders.findOne({ _id: new ObjectID(orderId) });
    return order;
  }

  // Add more query methods as needed
}

module.exports = Order;
const { ObjectID } = require('mongodb');
const connectToDatabase = require('../database');

class Order {
  constructor(buyerId, sellerId, products) {
    this.buyerId = new ObjectID(buyerId); // This references the user _id
    this.sellerId = new ObjectID(sellerId); // This references the user _id
    this.products = products.map((product) => ({
      productId: new ObjectID(product.productId),
      quantity: product.quantity,
    }));
    this.orderDate = new Date();
    this.confirmed = false;
    // Add more fields as needed
  }

  async save() {
    const db = await connectToDatabase();
    const orders = db.collection('orders');

    const result = await orders.insertOne(this);

    return result.ops[0];
  }

  static async findOrderById(orderId) {
    const db = await connectToDatabase();
    const orders = db.collection('orders');

    const order = await orders.findOne({ _id: new ObjectID(orderId) });
    return order;
  }

  // Add more query methods as needed
}

module.exports = Order;
