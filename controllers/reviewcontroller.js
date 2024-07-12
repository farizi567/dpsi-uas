const {db} = require('../config');

exports.submitReview = async (req, res) => {
  const { id } = req.params;
  const { userId, rating, comment } = req.body;

  try {
    const review = await db.collection('orders').doc(id).collection('reviews').add({
      userId,
      rating,
      comment,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).send({ message: 'Review submitted successfully', reviewId: review.id });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
