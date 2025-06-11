import mongoose from 'mongoose';
import z from 'zod';

// Define the stats object schema
const StatsZ = z.object({
    "Good Shot": z.number(),
    "Straight Pull": z.number(),
    "Hook": z.number(),
    "Pull Hook": z.number(),
    "Fat": z.number(),
    "Top": z.number(),
    "Push Slice": z.number(),
    "Slice": z.number(),
    "Straight Push": z.number()
});

// Define the base range session schema
const baseRangeSessionZ = z.object({
    name: z.string(),
    shots: z.number(),
    stats: StatsZ,
    total: z.number()
});

// Extended schema with MongoDB fields
const rangeSessionZ = baseRangeSessionZ.extend({
    _id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
});

// TypeScript types
export type BaseRangeSession = z.infer<typeof baseRangeSessionZ>;
export type RangeSession = z.infer<typeof rangeSessionZ>;

// Mongoose schema
const RangeSessionScheme = {
    userId: String,
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    name: String,
    shots: Number,
    stats: {
        "Good Shot": Number,
        "Straight Pull": Number,
        "Hook": Number,
        "Pull Hook": Number,
        "Fat": Number,
        "Top": Number,
        "Push Slice": Number,
        "Slice": Number,
        "Straight Push": Number
    },
    total: Number,
    createdAt: Date,
    updatedAt: Date
};

export const sessionSchema = new mongoose.Schema(RangeSessionScheme, {
    timestamps: true
});

export { rangeSessionZ as RangeSessionZ };

