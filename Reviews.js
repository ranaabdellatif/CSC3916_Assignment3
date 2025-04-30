const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  username: { type: String, required: true },
  review: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, required: true }
});

module.exports = mongoose.model('Review', reviewSchema);
