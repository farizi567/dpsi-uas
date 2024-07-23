const {db} = require('../config');
const admin = require('firebase-admin');

exports.placeOrder = async (req, res) => {
  const { userId, items, totalPrice, shippingAddress, paymentMethod } = req.body;

  try {
    const order = await db.collection('orders').add({
      userId,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).send({ message: 'Order placed successfully', orderId: order.id });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const orderDoc = await db.collection('orders').doc(id).get();

    if (!orderDoc.exists) {
      return res.status(404).send({ message: 'Order not found' });
    }

    res.status(200).send(orderDoc.data());
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
