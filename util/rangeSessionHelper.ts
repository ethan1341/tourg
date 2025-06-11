import {User} from "../model/userSchema";
import {handleDbError, RespType} from "./responseHelper";
import {userPaths} from "../model/shared";

export const removeRangeSession  = async (userId: string, indexId: string): Promise<typeof User | null | RespType> =>{
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    'settings.rangeSessions': { _id: indexId }
                }
            },
            { new: true }
        ) as typeof User | null | RespType;
        return user;
    } catch (e) {
        return handleDbError(e)
    }
}

export const addRangeSession = async (userId: string, data: any): Promise<typeof User | null | RespType> => {
    try {
        console.log('=== Adding Range Session ===');
        console.log('User ID:', userId);
        console.log('Data to add:', JSON.stringify(data, null, 2));

        // First verify user exists and check structure
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            console.log('❌ User not found:', userId);
            return null;
        }
        console.log('✅ Found user:', existingUser.id);
        console.log('Current user structure:', JSON.stringify(existingUser, null, 2));

        // Initialize settings and rangeSessions array if they don't exist
        const updateOps = {
            $set: {
                'settings': existingUser.settings || {}
            },
            $push: {
                'settings.rangeSessions': data
            }
        };

        if (!existingUser.settings) {
            console.log('⚠️ Settings object not found, initializing...');
        }

        console.log('Update operation:', JSON.stringify(updateOps, null, 2));

        // Perform the update
        const userData = await User.findByIdAndUpdate(
            userId,
            updateOps,
            {
                new: true,
                runValidators: true,
                upsert: false
            }
        ) as typeof User | null;

        console.log('✅ Update complete. New user data:', JSON.stringify(userData, null, 2));
        return userData;
    } catch (e: any) {
        console.error('❌ Error adding range session:', e);
        console.error('Error stack:', e.stack);
        return handleDbError(e);
    }
}

export const getRangeSessions = async (id: string)=>{
    try{
        console.log('Getting range sessions for user:', id);
        const user = await User.findById(id).lean();
        console.log('Found user:', user?.id);
        
        const sessions = user?.settings?.rangeSessions;
        console.log('Found sessions:', Array.isArray(sessions) ? sessions.length : 'none');
        
        if(sessions && Array.isArray(sessions) && sessions.length > 0){
            return sessions;
        }else{
            console.log('No sessions found');
            return null;
        }
    }catch(e){
        console.error('Error getting range sessions:', e);
        throw e;
    }
}

export const updateRangeSession = async (
    userId: string,
    indexId: string,
    data: any
): Promise<typeof User | null| RespType> => {
    try {
        const userData = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    'settings.rangeSessions.$[session]': data
                }
            },
            {
                arrayFilters: [{ 'session._id': indexId }],
                new: true,
                runValidators: true
            }
        ) as typeof User | null;
        return userData;
    } catch (e) {
        return handleDbError(e)
    }
}
