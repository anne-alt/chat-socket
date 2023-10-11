const { ObjectID } = require('mongodb');
const connectToDatabase = require('../database');

class Product {
  constructor(name, description, price, sellerId) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.sellerId = new ObjectID(sellerId); // This references the user _id
    this.creationDate = new Date();
    // Add more fields as needed
  }

  async save() {
    const db = await connectToDatabase();
    const products = db.collection('products');

    const result = await products.insertOne(this);

    return result.ops[0];
  }

  static async findProductById(productId) {
    const db = await connectToDatabase();
    const products = db.collection('products');

    const product = await products.findOne({ _id: new ObjectID(productId) });
    return product;
  }

  // Add more query methods as needed
}

module.exports = Product;
