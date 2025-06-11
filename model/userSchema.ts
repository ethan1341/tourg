import {z} from 'zod';
import {ClubPresetZ, ClubPreset, BaseClubPresetZ} from "./clubPresetSchema";
import mongoose from "mongoose";
import { googleAuthSchema } from './authSchema';
import {sessionSchema, RangeSession, RangeSessionZ} from "./rangeSessionSchema";

// ===== Zod Schema - Add validations here =====
let BaseUserSettingZ = z.object({
    dexterity:  z.enum(['left', 'right']),
    clubPresets: z.array(ClubPresetZ).max(5, "You can only have up to 5 club presets"),
    rangeSessions: z.array(RangeSessionZ).max(10, "You can only have up to 10 range sessions"),
    isPremium: z.boolean()
})

const UserSettingZ = BaseUserSettingZ.extend({
    _id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
})

// ===== Mongoose Schema - Add database validations here =====
const userSettingSchema = new mongoose.Schema({
    dexterity: {
        type: String,
        required: true,
        enum: ['left', 'right']
    },
    rangeSessions: {
        type:Array<RangeSession>,
        validate:[
            {
                validator: function(array: any[]) {
                    return array.length <= 10;  
                },
                message: "You can only have up to 10 range sessions"
            }
        ]
    },
    clubPresets: {
        type: Array<ClubPreset>,
        validate: [
            {
                validator: function(array: any[]) {
                    return array.length <= 5;
                },
                message: "You can only have up to 5 club presets"
            }
        ]
    },
    isPremium: Boolean
}, { _id: false })

type UserSetting = z.infer<typeof UserSettingZ>
type BaseUserSetting = z.infer<typeof BaseUserSettingZ>

export { UserSetting, BaseUserSetting }

const userProfileSchema = new mongoose.Schema({
    id: String,
    settings: userSettingSchema,
    auth: googleAuthSchema,
    accessToken: {
        type: String,
        required: true,
        select: false // Exclude from queries by default for security
    },
    refreshToken: {
        type: String,
        select: false // Exclude from queries by default for security
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt
    collection: 'users'
});

export const User = mongoose.model('User', userProfileSchema);