import {User} from "../model/userSchema";
import {handleDbError, RespType} from "./responseHelper";
import {userPaths} from "../model/shared";
import mongoose from "mongoose";




export const updateClubPreset = async (
    userId: string,
    indexId: string,
    data: any // Changed from T[keyof T] to any for flexibility
): Promise<typeof User | null| RespType> => {
    try {
        const userData = await User.findOneAndUpdate(
            {id:userId},
            {
                $set: {
                    [`${userPaths.clubPreset}.$[preset]`]: data
                }
            } ,
            {
                arrayFilters: [{ 'preset._id': indexId }],
                new: true,
                runValidators: true
            }
        ) as typeof User | null ;
        return userData
    } catch (e) {
        return handleDbError(e)
    }
}

export const removeClubPreset = async (userId: string, indxId: string): Promise<typeof User | null | RespType> => {
    try {
        const user = await User.findOneAndUpdate(
            {id:userId},
            {
                $pull: {
                    [userPaths.clubPreset]: { _id: indxId }
                }
            },
            { new: true }
        ) as typeof User | null | RespType;
        return user;
    } catch (e) {
        throw e
    }
}

export const addClubPreset = async (userId: string, data:any): Promise<typeof User | null | RespType> => {
    try {
        // Generate an _id for the new club preset
        const clubPresetWithId = {
            ...data,
            _id: new mongoose.Types.ObjectId().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const user = await User.findOneAndUpdate(
            { id: userId },
            {
                $push: {
                    [userPaths.clubPreset]: clubPresetWithId
                }
            },
            { new: true }
        ) as typeof User | null | RespType;
        return user;
    } catch(e) {
        throw e
    }
}

export const getClubPresets = async (id: string)=>{
    try{
        const user = await User.findOne({ id: id })
        const presets = user?.settings?.clubPresets
        if(presets){
            return presets
        }else{
            console.log(1)
            return []
        }
    }catch(e){
        console.log(e,'what is this')
       throw e
    }
}
