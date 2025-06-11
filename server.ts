import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const cors = require('cors');
import passport from "passport";
import {PassportStrategies} from "./auth/PassportStrategies";
import {googleStrategy} from "./auth/auth";
import {connectDB} from "./util/dbConnect";
import {BaseClubPreset, BaseClubPresetZ, ClubPreset} from "./model/clubPresetSchema";
import {auth} from "./middleware/auth";
import {validate} from "./middleware/validaton";
import {clubPresetRouter, rangeSessionRouter} from "./route/routes";
import {ResponseType, sendResponse} from "./util/responseHelper";

const app = express();

// Environment configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// CORS configuration
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));

app.use(express.json());

new PassportStrategies(googleStrategy, app);

app.use('/api/clubs', clubPresetRouter);
app.use('/api/rangeSession', rangeSessionRouter);

app.get('/api/me', (req: express.Request, res: express.Response) => {
    if (req.session.user) {
        sendResponse(res, ResponseType.SUCCESS, req.session.user);
    } else {
        sendResponse(res, ResponseType.UNAUTHORIZED);
    }
});

app.get('/auth/google/register', (req: express.Request, res: express.Response, next) => {
    req.session.authIntent = 'register';
    next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/login', (req, res, next) => {
    req.session.authIntent = 'login';
    next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/oauth2callback', (req, res, next) => {
    console.log('OAuth Callback - Initial Session State:', req.session)
    passport.authenticate('google', (err: any, user: any, info: any) => {
        console.log('OAuth Callback - After Auth:')
        console.log('Error:', err)
        console.log('User:', user)
        console.log('Info:', info)
        console.log('Session:', req.session)
        
        if (err) {
            console.error('Authentication Error:', err);
            return res.redirect(`${CLIENT_URL}/login?error=auth_failed&message=${encodeURIComponent(err.message)}`);
        }
        
        if (!user) {
            console.error('No user returned from authentication');
            return res.redirect(`${CLIENT_URL}/login?error=auth_failed&message=User not found`);
        }
        
        // Set the user session
        req.session.user = user;
        console.log('Session after setting user:', req.session)
        
        // Success - redirect to metronome page
        return res.redirect(`${CLIENT_URL}/metronome`);
    })(req, res, next);
});

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    console.log(`Client URL: ${CLIENT_URL}`);
    await connectDB();
});
