require('dotenv').config();  // This line should be at the very top
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process if the connection fails (optional)
  }
};

connectDB();

// Movie schema

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  releaseDate: { 
    type: Number, 
    min: [1900, 'Must be greater than 1899'], 
    max: [2100, 'Must be less than 2100']
  },
  genre: {
    type: String,
    enum: [
      'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 
      'Thriller', 'Western', 'Science Fiction'
    ],
  },
  actors: [{
    actorName: String,
    characterName: String,
  }],
});

// Check if the model exists before defining it
const Movie = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);

//module.exports = Movie;

module.exports = mongoose.model('Movie', MovieSchema);