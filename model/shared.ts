import {z} from 'zod';

export const ClubZ = z.object({
    name: z.string(),
    swing: z.number()
})


export type Club = z.infer<typeof ClubZ>;

export enum userPaths {
    clubPreset = 'settings.clubPresets',
    dexterity = 'settings.dexterity',
    savedRangeSessions = 'settings.rangeSessions'

}