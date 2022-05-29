import { Response } from 'express';

export default function returnError(message: string, res: Response){
    return res.status(404).json({
        status: 'error',
        message
    })
}