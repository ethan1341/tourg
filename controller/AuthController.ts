import { Request, Response } from 'express';
import { ResponseType, sendResponse, sendErrorResponse, handleDbError } from '../util/responseHelper';

const logout = (req: Request, res: Response) => {
    try {
        // Clear the session and auth token
        req.session.user = null;
        req.headers.authorization = undefined;
        
        // Send success response using custom response helper
        sendResponse(res, ResponseType.SUCCESS);
    } catch (error) {
        sendErrorResponse(res, error);
    }
}

export { logout };