import express from "express";
import {handleDbError, ResponseType, sendErrorResponse, sendResponse} from "../util/responseHelper";
import {addRangeSession, getRangeSessions, removeRangeSession} from "../util/rangeSessionHelper";
import {updateClubPreset} from "../util/userHelper";


export const addUserRangeSession = async (req: express.Request, res: express.Response)=>{
    console.log('=== Range Session Controller ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Session user:', req.session.user);
    
    let user = req.session.user;
    let rangeSession = req.body;
    
    if (!user) {
        console.log('❌ No user in session');
        sendResponse(res, ResponseType.UNAUTHORIZED);
        return;
    }
    
    if (!rangeSession) {
        console.log('❌ No range session data in request');
        sendResponse(res, ResponseType.MISSING_BODY);
        return;
    }

    try{
        console.log('Calling addRangeSession with:', {
            userId: user.id,
            rangeSession: rangeSession
        });
        
        let newRangeSession = await addRangeSession(user.id, rangeSession);
        console.log('Result from addRangeSession:', newRangeSession);
        
        sendResponse(res, ResponseType.SUCCESS, newRangeSession);
    }catch(e){
        console.error('❌ Error in controller:', e);
        sendErrorResponse(res, handleDbError(e))
    }
}
export const getUserRangeSessions = async (req: express.Request, res: express.Response)=>{
    let user = req.session.user
    try{
        let clubPresets = await getRangeSessions(user.id)
        if(clubPresets === null){
            sendResponse(res, ResponseType.NO_CONTENT)
        }
        sendResponse(res,ResponseType.SUCCESS, clubPresets);
    }catch(e){
        sendErrorResponse(res,handleDbError(e))
    }
}

export const removeUserRangeSession =  async (req: express.Request, res: express.Response)=> {
    let user = req.session.user
    let selectedId = req.body.rangeSessionId
    try{
        if(selectedId){
            await removeRangeSession(user.id, selectedId)
            sendResponse(res,ResponseType.SUCCESS, selectedId);
        }else{
            sendResponse(res, ResponseType.MISSING_BODY)
        }
    }catch(e){
        sendErrorResponse(res,handleDbError(e))
    }
}

