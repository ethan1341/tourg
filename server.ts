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
//const router = app.Router();
app.use(cors({
    origin: true, // or '*'
    credentials: true // if you need to send cookies
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

declare module 'express-session' {
    interface SessionData {  // Only extend the interface
        authIntent?: string;
        user?: any;
    }
}

app.get('/auth/google/register', (req: Express.Request, res: express.Response, next) => {
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
            return res.redirect(`http://localhost:3000/login?error=auth_failed&message=${encodeURIComponent(err.message)}`);
        }
        
        if (!user) {
            console.error('No user returned from authentication');
            return res.redirect('http://localhost:3000/login?error=auth_failed&message=User not found');
        }

        // Set the user session
        req.session.user = user;
        console.log('Session after setting user:', req.session)
        
        // Success
        return res.redirect('http://localhost:3000/metronome');
    })(req, res, next);
});

app.listen(process.env.PORT, async ()=>{
   await connectDB()
})

//okay so the server gets the signtarue back then we hash the sessionid and secret to make sure iot matches the signytaure