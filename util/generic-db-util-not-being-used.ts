import mongoose from "mongoose";

export const deleteSettingsArrayIndex = async <T>(userId: string, indexId: string, path: string, model: mongoose.Model<T>)=>{
    try {
        const user = await model.findOneAndUpdate(
            { id: userId }, // Fix: wrap userId in filter object
            {
                $unset: { [`${path}.$[elem]`]: 1 } as mongoose.UpdateQuery<T>,
            },
            {
                arrayFilters: [{ 'elem._id': indexId }]
            }
        );
    }catch (error){
        throw error;
    }
}
//todo fix any both places
export const addToSettingsArray =  async <T>(userId: string, path:string, data:any, model: mongoose.Model<T>)=>{
    try{
        const user = await model.findOneAndUpdate({id: userId},{
            $push:{
                $push: { [path]: data }
            }
        },{new:true})
    }catch (error){
        throw error
    }
}
// too generic
export const removeFromSettingsArray =   async <T>(userId: string, indxId: string, path:string, model: mongoose.Model<T>)=>{
    try{
        const user = await model.findOneAndUpdate({id: userId},{
            $pull:{
                $pull: { [path]: { id: indxId } }
            }
        })
    }catch(e){
        throw e
    }
}

export const updateSettingsArray = async <T>(
    userId: string,
    indexId: string,
    path: string,
    model: mongoose.Model<T>,
    data: any // Changed from T[keyof T] to any for flexibility
): Promise<T | null> => {
    try {
        const userData = await model.findByIdAndUpdate(
            userId,
            {
                $set: {
                    [`${path}.$[preset]`]: data
                }
            } as mongoose.UpdateQuery<T>,
            {
                arrayFilters: [{ 'preset._id': indexId }],
                new: true,
                runValidators: true
            }
        );

        return userData;
    } catch (error) {
        console.error('Error updating settings array:', error);
        throw error;
    }
}


export const updateUser = async <T>(
    userId: string,
    key: keyof T,           // Use keyof T to ensure key exists on T
    data: T[keyof T],       // Data should match the field type
    model: mongoose.Model<T>
): Promise<T | null> => {
    const newEntry = await model.findByIdAndUpdate(
        userId, //todo
        { [key]: data } as mongoose.UpdateQuery<T>,  // Type assertion
        { new: true }
    );
    return newEntry;
}




