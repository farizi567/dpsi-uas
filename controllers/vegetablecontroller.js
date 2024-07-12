const {db} = require('../config');

exports.getAllVegetables = async (req, res) => {
  try {
    const vegetablesSnapshot = await db.collection('vegetables').get();
    const vegetables = vegetablesSnapshot.docs.map(doc => doc.data());
    res.status(200).send(vegetables);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getVegetableById = async (req, res) => {
  const { id } = req.params;

  try {
    const vegetableDoc = await db.collection('vegetables').doc(id).get();

    if (!vegetableDoc.exists) {
      return res.status(404).send({ message: 'Vegetable not found' });
    }

    res.status(200).send(vegetableDoc.data());
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.addVegetable = async (req, res) => {
  const { name, description, price, photo } = req.body;

  try {
    await db.collection('vegetables').add({ name, description, price, photo });
    res.status(201).send({ message: 'Vegetable added successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateVegetable = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, photo } = req.body;

  try {
    await db.collection('vegetables').doc(id).update({ name, description, price, photo });
    res.status(200).send({ message: 'Vegetable updated successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteVegetable = async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('vegetables').doc(id).delete();
    res.status(200).send({ message: 'Vegetable deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
