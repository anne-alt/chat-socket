const { ObjectId } = require('mongodb');
const connectToDatabase = require('../database');

class User {
  constructor( email, username, password, category) {
    this.email = email;
    this.username = username;
    this.password = password;
    this.category = category; // 'buyer' or 'seller'
  }

  async save() {
    const db = await connectToDatabase();
    const users = db.collection('users');
  
    const insertionResult = await users.insertOne(this);
  
    if (insertionResult.acknowledged) {
      const insertedUser = await users.findOne({ email: this.email });
      return insertedUser;
    } else {
      throw new Error('User insertion failed');
    }
  }

  static async findUserById(userId) {
    const db = await connectToDatabase();
    const users = db.collection('users');

    const user = await users.findOne({ _id: new ObjectId(userId) });
    return user;
  }

  static async findByEmail(email) {
    const db = await connectToDatabase();
    const users = db.collection('users');

    const user = await users.findOne({ email });
    return user;
  }

}

module.exports = User;
