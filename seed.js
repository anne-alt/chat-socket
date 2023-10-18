const { faker } = require('@faker-js/faker');
const { ObjectId } = require('mongodb');
const connectToDatabase = require('./database');
const User = require('./models/user');
const Product = require('./models/product');
const bcrypt = require('bcrypt');

const generateRandomData = async () => {
  const db = await connectToDatabase();
  const users = db.collection('users');
  const products = db.collection('products');

  // Generate 10 random users
  const sampleUsers = [];
  for (let i = 0; i < 10; i++) {
    const email = faker.internet.email();
    const username = faker.internet.userName();
    const password = await bcrypt.hash(username, 10); // Encrypt the password
    const category = i % 2 === 0 ? 'seller' : 'buyer'; // Alternates between seller and buyer
    const newUser = new User(email, username, password, category);
    sampleUsers.push(await newUser.save());
  }

  // Generate 10 random products
  const sampleProducts = [];
  for (let i = 0; i < 10; i++) {
    const name = faker.commerce.productName();
    const description = faker.lorem.sentence();
    const price = faker.commerce.price();
    const seller = sampleUsers.find((user) => user.category === 'seller'); // Find a valid seller
    const newProduct = new Product(name, description, price, seller._id);
    sampleProducts.push(await newProduct.save());
  }

  const options = { ordered: true };
  const userResult = await users.insertMany(sampleUsers, options);
  console.log(`${userResult.insertedCount} user documents were inserted`);

  const productResult = await products.insertMany(sampleProducts, options);
  console.log(`${productResult.insertedCount} product documents were inserted`);

  console.log('Seed data generated successfully.');

  db.close();
};

generateRandomData();
