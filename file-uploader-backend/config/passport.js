require('dotenv').config();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// PrismaClient instance
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//  Setup Local Strategy for authentication
passport.use(
    'local',
    new LocalStrategy({ usernameField: 'email'}, async (email, password, done) => {
        try {
            // Find user by email
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });

            // Check if user exists
            if (!user) {
                return done(null, false, { message: 'User with that email does not exist' });
            }

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.password);

            // Check if passwords match
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password' });
            }

            // Return user if everything is ok
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
)

// Serialize user
passport.serializeUser(async (user, done) => {
    done(null, { id: user.id });
});

passport.deserializeUser(async (user, done) => {
    try {
        const userData = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        })

        done(null, userData);

    } catch (err) {
        return done(err);
    }
})


module.exports = passport;