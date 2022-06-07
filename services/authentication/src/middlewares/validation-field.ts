import { NextFunction, Request, Response } from 'express'

import returnError from './response-error'

function validationName(req: Request, res: Response, next: NextFunction) {
    const name: string | null = req.body.name

    if (name === null) return returnError('field name equal null', res)
    else if (name.length <= 4) return returnError('name is less than 4', res)
    else if (name.length >= 32) return returnError('name is more than 32', res)
    next()
}

function validationTokenNotification(req: Request, res: Response, next: NextFunction) {
    const tokenNotification: string | null = req.body['token-notification']
    
    if (tokenNotification === null) return returnError('field token-notification equal null', res)
    else if (tokenNotification.length <= 48) return returnError('token-notification is less than 48', res)
    next()
}

function validationPassword(req: Request, res: Response, next: NextFunction) {
    const password: string | null = req.body.password
    
    if (password === null) return returnError('field password equal null', res)
    else if (password.length <= 11) return returnError('password is less than 11', res)
    else if (password.length >= 42) return returnError('password is more than 42', res)
    next()
}

function validationEmail(req: Request, res: Response, next: NextFunction) {
    const email: string | null = req.body.email
    
    if (email === null) return returnError('field email equal null', res)
    else if (email.length <= 20) return returnError('email is less than 20', res)
    else if (email.length >= 42) return returnError('email is more than 42', res)
    else if(!email.includes('@')) return returnError('not is email', res)
    next()
}

export { validationName, validationTokenNotification, validationEmail, validationPassword };