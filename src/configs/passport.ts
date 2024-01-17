import mongoose from "mongoose"
import passport from "passport"
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import * as dotenv from "dotenv";
dotenv.config();

passport.use('login', new localStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
    async (username, password, done) => {
        try {
            const user = await mongoose.model('User').findOne({ username: username })

            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            const validate = await bcrypt.compare(password, user.password);

            if (!validate) {
                return done(null, false, { message: 'Password does not correct' })
            }

            return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
            return done(error);
        }
    }
))

passport.use(new JWTStrategy({
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
},
    async (token, done) => {
        try {
            const user = await mongoose.model('User').findOne({ username: token.user.username })
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            return done(null, user)
        } catch (error) {
            done(error);
        }
    }
))