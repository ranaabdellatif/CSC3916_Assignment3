require('dotenv').config();  // This line should be at the very top

const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Use bcrypt, not bcrypt-nodejs

// No need for mongoose.Promise = global.Promise;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error); // Log the actual error object
    process.exit(1); // Exit the process if the connection fails (optional, but good practice)
  }
};

connectDB();

// Define User Schema first
const UserSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: { type: String, required: true } // Hash this in production
});

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {  // Use async/await for cleaner code
  const user = this;

  if (!user.isModified('password')) return next();

  try {
    const hash = await bcrypt.hash(user.password, 10); // 10 is the salt rounds (adjust as needed)
    user.password = hash;
    next();
  } catch (err) {
    return next(err);
  }
});

// Compare the password
UserSchema.methods.comparePassword = async function(password) { // Use async/await
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    return false; // Or handle the error as you see fit
  }
};

// Create the User model from the schema
const User = mongoose.model('User', UserSchema);

module.exports = User;
