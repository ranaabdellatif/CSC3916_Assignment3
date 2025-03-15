require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const passportJwt = require('passport-jwt'); // Import passport-jwt

const User = require('./Users');
const Movie = require('./Movies');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// JWT Strategy Configuration
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // Extract JWT from the Authorization header
opts.secretOrKey = process.env.JWT_SECRET; // Secret key for verifying JWT

// JWT Strategy
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        // Using async/await for finding user by ID
        const user = await User.findById(jwt_payload.id);  // Find the user by ID from the JWT payload
        if (user) {
            return done(null, user);  // If user is found
        } else {
            return done(null, false);  // If user not found
        }
    } catch (err) {
        return done(err, false);  // If there's an error, pass it to the done function
    }
}));

app.use(passport.initialize()); // Initialize passport

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ success: false, msg: 'Please include both username and password to signup.' });
    }

    try {
        const user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
        });

        await user.save();
        res.status(201).json({ success: true, msg: 'Successfully created new user.' });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ success: false, message: 'A user with that username already exists.' });
        } else {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
        }
    }
});

// Signin Route
router.post('/signin', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).select('name username password');

    if (!user) {
      return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });
    }

    console.log("Signin attempt:", { username: req.body.username, password: req.body.password });
    console.log("User found:", user);

    const isMatch = await user.comparePassword(req.body.password);

    console.log("Password match:", isMatch);  // Log the result of password comparison

    if (isMatch) {
      const userToken = { id: user._id, username: user.username };
      const token = jwt.sign(userToken, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ success: true, token: 'JWT ' + token });
    } else {
      res.status(401).json({ success: false, msg: 'Authentication failed. Incorrect password.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
  }
});

// Movie Routes - Protected by JWT
router.route('/movies')
    .get(passport.authenticate('jwt', { session: false }), async (req, res) => {  // Protect route with passport JWT authentication
        try {
            const movies = await Movie.find();
            res.json(movies);
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error retrieving movies', error: err });
        }
    })
    .post(passport.authenticate('jwt', { session: false }), async (req, res) => {  // Protect route with passport JWT authentication
        try {
            const { title, releaseDate, genre, actors } = req.body;

            if (!title || !releaseDate || !genre || actors.length === 0) {
                return res.status(400).json({ success: false, message: 'Missing required movie fields' });
            }

            const newMovie = new Movie({ title, releaseDate, genre, actors });
            await newMovie.save();

            res.status(201).json({ success: true, message: 'Movie added successfully' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error adding movie', error: err });
        }
    });

// Movie Routes for specific movie by ID
router.route('/movies/:id')
    .put(passport.authenticate('jwt', { session: false }), async (req, res) => {  // Protect route with passport JWT authentication
        try {
            const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });

            if (!movie) {
                return res.status(404).json({ success: false, message: 'Movie not found' });
            }

            res.json({ success: true, message: 'Movie updated', movie });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error updating movie', error: err });
        }
    })
    .delete(passport.authenticate('jwt', { session: false }), async (req, res) => {  // Protect route with passport JWT authentication
        try {
            const movie = await Movie.findByIdAndDelete(req.params.id);

            if (!movie) {
                return res.status(404).json({ success: false, message: 'Movie not found' });
            }

            res.json({ success: true, message: 'Movie deleted' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error deleting movie', error: err });
        }
    });

app.use('/', router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

