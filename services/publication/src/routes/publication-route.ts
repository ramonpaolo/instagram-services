import express from 'express'

const app = express()

app.route('/').post(async (req, res) => {
    const {text, _idUser, images}: {text: string, _idUser: number, images: string[]} = req.body
    console.log(text)
    console.log(_idUser)
    console.log(images)

    const b = new Buffer(images[0], 'base64')

    console.log(b)
    
    res.sendStatus(200)
})

export default app;