const { ObjectId } = require('mongodb');
const connectToDatabase = require('../database');

class Order {
  constructor(buyerId, products, buyerName, productName) {
    this.buyerId = new ObjectId(buyerId);
    this.products = products.map((product) => ({
      productId: new ObjectId(product.productId),
      quantity: product.quantity,
      sellerId: new ObjectId(product.sellerId),
      productName: product.productName
    }));
    this.orderDate = new Date();
    this.confirmed = false;
    this.buyerName = buyerName;
  }

  async save() {
    const db = await connectToDatabase();
    const orders = db.collection('orders');
  
    const insertionResult = await orders.insertOne(this);
  
    if (insertionResult.acknowledged) {
      // The insertion was acknowledged, so we find the order by its ID
      const insertedOrder = await orders.findOne({ _id: insertionResult.insertedId });
      return insertedOrder;
    } else {
      throw new Error('Order insertion failed');
    }
  }

  static async findOrderById(orderId) {
    const db = await connectToDatabase();
    const orders = db.collection('orders');

    const order = await orders.findOne({ _id: new ObjectId(orderId) });
    return order;
  }

  static async updateOrder(orderId, updatedData) {
    const db = await connectToDatabase();
    const orders = db.collection('orders');

    const result = await orders.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: updatedData }
    );

    return result.modifiedCount;
  }

  static async deleteOrder(orderId) {
    const db = await connectToDatabase();
    const orders = db.collection('orders');

    const result = await orders.deleteOne({ _id: new ObjectId(orderId) });
    return result.deletedCount;
  }

  static async findAllOrders() {
    const db = await connectToDatabase();
    const orders = db.collection('orders');

    const allOrders = await orders.find().toArray();
    return allOrders;
  }

  static async findUserOrders(userId) {
    const db = await connectToDatabase();
    const orders = db.collection('orders');

    const userOrders = await orders.find({ buyerId: new ObjectId(userId) }).toArray();

    return userOrders;
  }

}

module.exports = Order;
