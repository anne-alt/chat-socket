const { ObjectId } = require('mongodb');
const connectToDatabase = require('../database');

class Product {
  constructor(name, description, price, sellerId) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.sellerId = new ObjectId(sellerId); // This references the user _id
    this.creationDate = new Date();
  }

  async save() {
    const db = await connectToDatabase();
    const products = db.collection('products');
  
    const insertionResult = await products.insertOne(this);
  
    if (insertionResult.acknowledged) {
      const insertedProduct = await products.findOne({ name: this.name, sellerId: this.sellerId });
      return insertedProduct;
    } else {
      throw new Error('Product insertion failed');
    }
  }
  
  static async findProductById(productId) {
    const db = await connectToDatabase();
    const products = db.collection('products');

    const product = await products.findOne({ _id: new ObjectID(productId) });
    return product;
  }

}

module.exports = Product;
