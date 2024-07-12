const {db} = require('../config');

exports.addToCart = async (req, res) => {
  const { userId, vegetableId, quantity } = req.body;

  try {
    const cartDoc = db.collection('carts').doc(userId);
    const cart = await cartDoc.get();

    if (!cart.exists) {
      await cartDoc.set({ items: [{ vegetableId, quantity }] });
    } else {
      const items = cart.data().items;
      const existingItem = items.find(item => item.vegetableId === vegetableId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        items.push({ vegetableId, quantity });
      }

      await cartDoc.update({ items });
    }

    res.status(200).send({ message: 'Added to cart successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateCart = async (req, res) => {
  const { userId, vegetableId, quantity } = req.body;

  try {
    const cartDoc = db.collection('carts').doc(userId);
    const cart = await cartDoc.get();

    if (!cart.exists) {
      return res.status(404).send({ message: 'Cart not found' });
    }

    const items = cart.data().items;
    const item = items.find(item => item.vegetableId === vegetableId);

    if (item) {
      item.quantity = quantity;
      await cartDoc.update({ items });
      res.status(200).send({ message: 'Cart updated successfully' });
    } else {
      res.status(404).send({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cartDoc = db.collection('carts').doc(userId);
    const cart = await cartDoc.get();

    if (!cart.exists) {
      return res.status(404).send({ message: 'Cart not found' });
    }

    res.status(200).send(cart.data());
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
