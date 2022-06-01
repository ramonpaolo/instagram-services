import express from 'express'
import multer from 'multer'
import fs from 'fs'
import dotenv from 'dotenv'

// Settings
import RabbitMQ from '../settings/rabbitMQ'

// Controllers
import { setS3, uploadAWS } from '../controllers/upload-controller'
import { S3 } from 'aws-sdk'

dotenv.config()

const app = express()

const storage = multer.diskStorage({
    destination: 'images/',
    filename(_, file, callback) {
        callback(null, `${file.originalname}-${new Date().getTime()}.${file.originalname.split('.').pop()}`)
    },
})

const mul = multer({ storage })

interface IFile {
    originalname: string;
    mimetype: string;
    filename: string;
    size: number;
}

const rabbit = new RabbitMQ();

let s3: S3;
(async () => {
    await rabbit.connection()
    s3 = await setS3()
})()


app.route('/').post(mul.array('images'), async (req, res) => {
    const images: IFile[] = req.files as IFile[]

    const urlImages: string[] = ['']

    await Promise.all(images.map(async (v) => {
        const bitmap = fs.readFileSync(__dirname+'/../../images/'+v.filename);
        
        const url = await uploadAWS(s3, v.filename, bitmap)
        
        fs.rm(__dirname+'/../../images/'+v.filename, (err) => {
            if(err) console.log(err)
        })

        if(url !== null) urlImages.push(url)
    }))

    urlImages.shift()

    const { text, name, _id }: { text: string, name: string, _id: number } = req.body
    
    rabbit.sender('publication', JSON.stringify({ text, images: urlImages, author: name, _id }))

    res.status(200).json({status: 'success', message: 'Received request to publication'})
})

export default app;