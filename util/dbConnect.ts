import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {
        console.log('hello')
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.log('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

