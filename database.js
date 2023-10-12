require("dotenv").config();
const { MongoClient } = require('mongodb');

const uri = process.env.URI;
const client = new MongoClient(uri);

let dbInstance;

module.exports = async function connectToDatabase() {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db('buyamia');
  }
  return dbInstance;
};