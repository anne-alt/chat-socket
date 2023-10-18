async function fetchUserOrders(userId, userCategory) {
  try {
    const db = await connectToDatabase();
    const ordersCollection = db.collection('orders');

    let orders = [];

    if (userCategory === 'buyer') {
      orders = await ordersCollection.find({ buyerId: ObjectId(userId) }).toArray();
    } else if (userCategory === 'seller') {
      orders = await ordersCollection.find({ "products.sellerId": ObjectId(userId) }).toArray();
    }

    console.log("orders:", orders);

    return { orders };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}

module.exports = fetchUserOrders;
