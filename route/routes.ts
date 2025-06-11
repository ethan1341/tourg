import { Router } from 'express';
import {auth} from "../middleware/auth";
import {getClubPresets, } from "../util/userHelper";
import {
    addUserClubPreset,
    getUserClubPresets,
    removeUserClubPreset,
    updateUserClubPreset
} from "../controller/userController";
import {addRangeSession, getRangeSessions, removeRangeSession, updateRangeSession} from "../util/rangeSessionHelper";
import {addUserRangeSession, getUserRangeSessions, removeUserRangeSession} from "../controller/rangeSessionController";
import { logout } from '../controller/AuthController';
import {validate} from "../middleware/validaton";

export const clubPresetRouter = Router();
export const rangeSessionRouter = Router();
export const authSessionRouter = Router();

// Auth routes
authSessionRouter.post('/logout', auth, logout);

// Club Preset Routes
clubPresetRouter.get('/', auth, getUserClubPresets);
clubPresetRouter.post('/add', auth, validate(BaseClubPresetZ), addUserClubPreset);
clubPresetRouter.post('/remove', auth, validate(ClubPresetZ), removeUserClubPreset);
clubPresetRouter.post('/update', auth, validate(ClubPresetZ), updateUserClubPreset);

// Range Session Routes
rangeSessionRouter.get('/', auth, getUserRangeSessions);
rangeSessionRouter.post('/add', auth, addUserRangeSession);
rangeSessionRouter.post('/remove', auth, removeUserRangeSession);


