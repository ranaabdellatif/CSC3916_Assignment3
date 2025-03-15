var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('./Users');  // Ensure to import your User model
require('dotenv').config();  // For accessing environment variables

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");  // Extract JWT from the header (Authorization: jwt <token>)
opts.secretOrKey = process.env.JWT_SECRET;  // The secret key used for JWT signing

// Update the strategy to use async/await
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        // Use async/await for finding the user by ID
        const user = await User.findById(jwt_payload.id);  
        
        if (user) {
            return done(null, user);  // User found, authentication is successful
        } else {
            return done(null, false);  // User not found, authentication failed
        }
    } catch (err) {
        return done(err, false);  // If there's an error, pass it to the done function
    }
}));

// Export the middleware function to check if the user is authenticated
exports.isAuthenticated = passport.authenticate('jwt', { session: false });
exports.secret = opts.secretOrKey;  // Export the JWT secret key for usage elsewhere

