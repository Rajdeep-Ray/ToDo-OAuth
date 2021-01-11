const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');
const jwt = require('jsonwebtoken');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

require('dotenv').config()

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

exports.getToken = function (user) {
    return jwt.sign(user, process.env.SECRET, { expiresIn: 3600 })
};

var opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        // console.log("JWT payload", jwt_payload);
        // check if id exists or not
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
    }))


exports.verifyUser = passport.authenticate('jwt', { session: false });

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our db
        console.log(profile)
        User.findOne({ googleId: profile.id }).then((currentUser) => {
            if (currentUser) {
                // user exists
                // console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                // if not, create user
                new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email:profile._json.email,
                }).save().then((newUser) => {
                    // console.log('created new user: ', newUser);
                    done(null, newUser);
                });
            }
        });
    })
);