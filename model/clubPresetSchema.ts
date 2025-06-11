import mongoose from "mongoose";
import {z} from 'zod';
import {Club,ClubZ} from "./shared";

export const BaseClubPresetZ = z.object({
    name: z.string(),
    clubs: z.array(ClubZ),
    totalSwings: z.number(),
    clubCount: z.number()
})

//request coming in pagination in this case is a string
//run util function
// map to to your standard DTO

export const ClubPresetZ = BaseClubPresetZ.extend({
    _id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
})

export type BaseClubPreset = z.infer<typeof BaseClubPresetZ>;

export type ClubPreset = z.infer<typeof ClubPresetZ>

const ClubPresetSchemaType = {
    name: String,
    clubs: Array<Club>,
    totalSwings: Number,
    clubCount: Number,
    createdAt: String,
    UpdatedAt: String
}

export const clubPresetSchema = new mongoose.Schema(ClubPresetSchemaType)
export const ClubPreset = mongoose.model('ClubPreset', clubPresetSchema)