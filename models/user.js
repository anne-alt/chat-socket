const { ObjectID } = require('mongodb');
const connectToDatabase = require('../database');

class User {
  constructor(name, email, category, username) {
    this.email = email;
    this.username = username;
    this.category = category; // 'buyer' or 'seller'
    // Add more fields as needed
  }

  async save() {
    const db = await connectToDatabase();
    const users = db.collection('users');
  
    const insertionResult = await users.insertOne(this);
  
    if (insertionResult.acknowledged) {
      // The insertion was acknowledged, so we find the user by email
      const insertedUser = await users.findOne({ email: this.email });
      return insertedUser;
    } else {
      throw new Error('User insertion failed');
    }
  }

  static async findUserById(userId) {
    const db = await connectToDatabase();
    const users = db.collection('users');

    const user = await users.findOne({ _id: new ObjectID(userId) });
    return user;
  }

  // Find a user by email
  static async findByEmail(email) {
    const db = await connectToDatabase();
    const users = db.collection('users');

    const user = await users.findOne({ email });
    return user;
  }

  // Add more query methods as needed
}

module.exports = User;
