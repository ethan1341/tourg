import { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import {generateResponseObject, ResponseType, ResponseTypeToHttpStatus} from "../util/responseHelper";

config();

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if(req.session.user == null){
        res.status(ResponseTypeToHttpStatus[ResponseType.UNAUTHORIZED]).json(generateResponseObject(ResponseType.UNAUTHORIZED));
        return;
    }
    next();
};

