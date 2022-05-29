import express from 'express'
import { createUser, getDataUser } from '../controllers/user-controller'
import { validationName, validationTokenNotification } from '../middlewares/validation-field'

const app = express()

app.route('/').post(validationName, validationTokenNotification, async (req, res) => {
    const user = await createUser(req.body.name, req.body['token-notification'])

    if (user !== false) return res.status(201).json(user)
    else return res.status(404).json({
        status: 'fail',
        message: 'can\'t craete user'
    })
}).get(async (req, res) => {
    const { _id } = req.query

    const user = await getDataUser(Number(_id))

    if (user !== false) return res.status(200).json(user)
    else return res.status(404).json({
        status: 'fail',
        message: 'user not found'
    })
})

export default app