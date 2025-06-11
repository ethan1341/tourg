import express from "express";
import {
    addClubPreset,
    getClubPresets,
    removeClubPreset,
    updateClubPreset
} from "../util/userHelper";

import {
    handleDbError,
    ResponseType,
    sendErrorResponse,
    sendResponse
} from "../util/responseHelper";



export const updateUserClubPreset = async (req: express.Request, res: express.Response)=>{
    let user = req.session.user
    let selectedId = req.body.presetId
    let presetData = req.body.preset
    try{
        if(!selectedId || !presetData){
            sendResponse(res, ResponseType.NO_CONTENT)
        }
        let updatedPreset = await updateClubPreset(user.id,selectedId,presetData)
        if(updatedPreset == null){
            sendResponse(res, ResponseType.NO_CONTENT)
        }
        console.log(updatedPreset,'hello')
        sendResponse(res,ResponseType.SUCCESS,updatedPreset );
    }catch(e){
        sendErrorResponse(res,handleDbError(e))
    }
}

export const addUserClubPreset = async (req: express.Request, res: express.Response)=>{
    let user = req.session.user
    let clubPreset = req.body
    try{
        let newClubPreset = await addClubPreset(user.id,clubPreset)
        sendResponse(res,ResponseType.SUCCESS, newClubPreset);
    }catch(e){
        sendErrorResponse(res,handleDbError(e))
    }
}

export const getUserClubPresets = async (req: express.Request, res: express.Response)=>{
    let user = req.session.user
    try{
        console.log(user.id,'hello')
        let clubPresets = await getClubPresets(user.id)
        if(clubPresets === null){
            sendResponse(res, ResponseType.NO_CONTENT)
            return;
        }
        console.log(clubPresets,'what is presets')
        sendResponse(res,ResponseType.SUCCESS, clubPresets);
    }catch(e){
        sendErrorResponse(res,handleDbError(e))
    }
}

export const removeUserClubPreset =  async (req: express.Request, res: express.Response)=> {
    let user = req.session.user
    let selectedId = req.body.presetId
    try{
        if(selectedId){
            await removeClubPreset(user.id, selectedId)
            sendResponse(res,ResponseType.SUCCESS, selectedId);
        }else{
            sendResponse(res, ResponseType.MISSING_BODY)
        }
    }catch(e){
        sendErrorResponse(res,handleDbError(e))
    }
}