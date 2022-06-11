import { NextFunction, Request, Response } from 'express';
import fs from 'fs'

export default function verifyImage(req: Request, res: Response, next: NextFunction) {
    const file: Express.Multer.File | undefined = req.file;
    if (file == undefined) return res.status(404).json({ status: 'error', message: 'file not specified' })
    const bitmap = fs.readFileSync(file.path)
    fs.unlinkSync(file.path);
    res.locals.image = bitmap
    next()
}