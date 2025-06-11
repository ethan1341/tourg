import express from 'express'

export type RespType<T = any> = {
    code: ResponseType,
    message: ResponseMessage,
    data?: T
}
export enum ResponseType  {
    MISSING_BODY = "MISSING_BODY",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    DATABASE_ERROR = 'DATABASE_ERROR' ,
    DUPLICATE_ERROR = 'DUPLICATE_ERROR',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    SUCCESS = 'SUCCESS',
    UNAUTHORIZED = "UNAUTHORIZED",
    INVALID_ID = "INVALID_ID",        // Add this
    NOT_FOUND = "NOT_FOUND",
    NO_CONTENT = "NO_CONTENT"
}

export enum ResponseMessage {
    SUCCESS = "Request completed successfully",
    MISSING_BODY = "Request body is required",
    VALIDATION_ERROR = "Validation failed",
    DATABASE_ERROR = "Database operation failed",
    DUPLICATE_ERROR = "Resource already exists",
    INTERNAL_ERROR = "Internal server error occurred",
    UNAUTHORIZED = "User not authenticated",
    INVALID_ID = "Invalid ID format",
    NOT_FOUND = "Resource not found" ,
    NO_CONTENT = "No data found"
}


export const ResponseTypeMessage = {
    [ResponseType.SUCCESS]: ResponseMessage.SUCCESS,
    [ResponseType.MISSING_BODY]: ResponseMessage.MISSING_BODY,
    [ResponseType.VALIDATION_ERROR]: ResponseMessage.VALIDATION_ERROR,
    [ResponseType.DATABASE_ERROR]: ResponseMessage.DATABASE_ERROR,
    [ResponseType.DUPLICATE_ERROR]: ResponseMessage.DUPLICATE_ERROR,
    [ResponseType.INTERNAL_ERROR]: ResponseMessage.INTERNAL_ERROR,
    [ResponseType.UNAUTHORIZED]: ResponseMessage.UNAUTHORIZED,
    [ResponseType.INVALID_ID]: ResponseMessage.INVALID_ID,         // Add this
    [ResponseType.NOT_FOUND]: ResponseMessage.NOT_FOUND,
    [ResponseType.NO_CONTENT]: ResponseMessage.NO_CONTENT  // Add this
};


export const ResponseTypeToHttpStatus: Record<ResponseType, number> = {
    [ResponseType.SUCCESS]: 200,           // OK - Standard success
    [ResponseType.MISSING_BODY]: 400,      // Bad Request - Client sent invalid data
    [ResponseType.VALIDATION_ERROR]: 422,  // Unprocessable Entity - Validation failed
    [ResponseType.DUPLICATE_ERROR]: 409,   // Conflict - Resource already exists
    [ResponseType.DATABASE_ERROR]: 500,    // Internal Server Error - Database issue
    [ResponseType.INTERNAL_ERROR]: 500,    // Internal Server Error - Generic server error
    [ResponseType.UNAUTHORIZED]: 401,
    [ResponseType.INVALID_ID]: 400,
    [ResponseType.NOT_FOUND]: 404,
    [ResponseType.NO_CONTENT]: 202
};



export const generateResponseObject = <T>(code: ResponseType, data?:T)=>{
    let response:RespType = {
        code: ResponseType[code],
        message: ResponseTypeMessage[code]

    }
    if(data){
        response.data = data
    }
    return response
}


export const handleDbError = (e: any): RespType => {
    if (e.name === 'ValidationError') {
        return { code: ResponseType.VALIDATION_ERROR, message: ResponseMessage.VALIDATION_ERROR };
    }
    if (e.name === 'CastError') {
        return { code: ResponseType.INVALID_ID, message: ResponseMessage.INVALID_ID };
    }
    if (e.code === 11000) {
        return { code: ResponseType.DUPLICATE_ERROR, message: ResponseMessage.DUPLICATE_ERROR };
    }
    return { code: ResponseType.DATABASE_ERROR, message: ResponseMessage.DATABASE_ERROR };
};



export const  sendResponse = ( res: express.Response, responseType: ResponseType, data?: any) => {
    const response = generateResponseObject(responseType, data);
    res.status(ResponseTypeToHttpStatus[responseType]).json(response);
};

export const sendErrorResponse = (res: express.Response, e: any) => {
    const error = handleDbError(e);
    res.status(ResponseTypeToHttpStatus[error.code]).json(error);
};