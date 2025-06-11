import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';

import {profileToGoogleUser} from "../util/auth";
import { User } from '../model/userSchema';



export const googleStrategy: GoogleStrategy = new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "/auth/oauth2callback",
        passReqToCallback: true
    }, async (req: Express.Request, accessToken, refreshToken, profile: Profile, done) => {
    let intent = req.session.authIntent;
    console.log('Auth Intent:', intent);
    console.log('Google Profile:', {
        id: profile.id,
        email: profile._json.email,
        name: profile._json.name
    });

    if (intent == "register") {
       try {
            const userFound = await User.findOne({'auth.email': profile._json.email});
            if(userFound === null){
                const userData = profileToGoogleUser(profile, accessToken, refreshToken);
                console.log('Creating user with data:', userData)
                const newUser = await User.create(userData);
                console.log('✅ User created successfully');
                return done(null, newUser);
            } else {
                console.log('⚠️ User already exists');
                return done(new Error('User found, please try logging in'), false);
            }
       } catch(e) {
            console.error('❌ Database error:', e);
            return done(e, false);
       }
    }

    if (intent == "login") {
        try {
            console.log('Attempting to find user with email:', profile._json.email);
            const userFound = await User.findOne({'auth.email': profile._json.email});
            console.log('Database lookup result:', userFound);
            
            if(userFound === null){
                console.log('❌ No user found in database with email:', profile._json.email);
                return done(new Error('User not found. Please register first.'), false);
            } else {
                console.log('✅ User found in database:', {
                    id: userFound.id,
                    email: userFound.auth?.email
                });
                return done(null, userFound);
            }
        } catch(e) {
            console.error('❌ Database error:', e);
            console.error('Error details:', e);
            return done(e, false);
        }
    }

    // Fallback - should never reach here
    console.log('⚠️ Invalid intent:', intent);
    return done(new Error('Invalid intent'), false);
});
