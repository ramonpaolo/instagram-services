import { NextFunction, Request, Response } from 'express'

import returnError from './response-error'

function validationName(req: Request, res: Response, next: NextFunction) {
    const name: string | null = req.body.name

    if (name === null) return returnError('field name equal null', res)
    else if (name.length <= 3) return returnError('name is less than 3', res)
    else if (name.length >= 32) return returnError('name is more than 32', res)
    next()
}

function validationTokenNotification(req: Request, res: Response, next: NextFunction) {
    const tokenNotification: string | null = req.body['token-notification']
    
    if (tokenNotification === null) return returnError('field token-notification equal null', res)
    else if (tokenNotification.length <= 48) return returnError('token-notification is less than 48', res)
    next()
}

export { validationName, validationTokenNotification };