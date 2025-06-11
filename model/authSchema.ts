import {z} from 'zod'
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import mongoose from "mongoose";

export const baseGoogleAuthZ = z.object({
    email: z.string().email(),
    verified_email: z.boolean(),
    name: z.string(),
    given_name: z.string().optional(),
    family_name: z.string().optional(),
    picture: z.string().url().optional(),
    locale: z.string().optional(),
    accessToken: z.string(),
    refreshToken: z.string().optional(),
});


export type BaseGoogleAuth = z.infer<typeof baseGoogleAuthZ>;

export const GoogleAuthScheme = {
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    verified_email: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    given_name: {
        type: String,
        trim: true
    },
    family_name: {
        type: String,
        trim: true
    },
    picture: {
        type: String,
        validate: {
            validator: function(v: string) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Picture must be a valid URL'
        }
    },
    locale: {
        type: String,
        trim: true
    },
    accessToken: {
        type: String,
        required: true,
        select: false
    },
    refreshToken: {
        type: String,
        select: false
    }
};

export const googleAuthSchema = new mongoose.Schema(GoogleAuthScheme, { _id: false });

// Index for faster queries
googleAuthSchema.index({ email: 1 });
googleAuthSchema.index({ id: 1 });

// export const GoogleUser = mongoose.model('GoogleUser', googleAuthSchema);
