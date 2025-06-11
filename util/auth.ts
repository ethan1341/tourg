import {BaseGoogleAuth} from "../model/authSchema";
import {BaseUserSetting} from "../model/userSchema";

export function profileToGoogleUser(profile: any, accessToken: string, refreshToken?: string): {
    id: string,
    auth: BaseGoogleAuth,
    settings: BaseUserSetting,
    accessToken: string,
    refreshToken?: string
} {
    return {
        id: profile.id,
        auth: {
            email: profile._json.email,
            verified_email: profile._json.email_verified,
            name: profile._json.name || profile.displayName,
            given_name: profile._json.given_name,
            family_name: profile._json.family_name,
            picture: profile._json.picture,
            locale: profile._json.locale,
            accessToken: accessToken,
            refreshToken: refreshToken,
        },
        settings: {
            dexterity: 'right',
            rangeSessions: [],
            clubPresets: [],
            isPremium: false
        },
        accessToken,
        refreshToken
    };
}