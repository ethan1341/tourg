import {Schema, ZodError} from "zod";
import express, {NextFunction} from "express";
import {ResponseType,ResponseTypeToHttpStatus} from "../util/responseHelper";
import {generateResponseObject} from "../util/responseHelper";

export const validate = (schema: Schema)=>{
    return (req: express.Request, res: express.Response, next: NextFunction) => {
       if(req.body && Object.keys(req.body).length > 0){
           try {
               schema.parse(req.body);
               next(); // SUCCESS - continue to route handler
           }catch(error){
               res.status(ResponseTypeToHttpStatus[ResponseType.VALIDATION_ERROR]).json(generateResponseObject(ResponseType.VALIDATION_ERROR))
           }
       }else{
           res.status(ResponseTypeToHttpStatus[ResponseType.MISSING_BODY]).json(generateResponseObject(ResponseType.MISSING_BODY))
       }
    };
}