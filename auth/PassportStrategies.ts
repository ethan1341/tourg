import passport from 'passport'
import {Profile as GoogleProfile} from 'passport-google-oauth20'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import {Express} from "express";
import session from "express-session";

type PassportStrat = {
    strategy: GoogleStrategy
}
export class PassportStrategies {
    strategy: GoogleStrategy
    app: Express
    constructor(args:GoogleStrategy,app:Express) {
        this.strategy = args
        this.app = app
        this.initializeStrategy()
        this.initializePassport()
    }
    initializeStrategy() {
        passport.use('google', this.strategy);
    }
    initializePassport() {
        this.app.use(session({
            secret: process.env.SESSION_SECRET || 'your-secret-key',
            resave: false,
            saveUninitialized: true
        }));
        this.app.use(passport.initialize())
        this.app.use(passport.session())

        passport.serializeUser((user: any, done) => {
            done(null, user);
        });

        passport.deserializeUser((user: any, done) => {
            done(null, user);
        });
    }

}