import express from 'express'
import multer from 'multer'

// Controllers
import { createUser, deleteUser, getDataUser, updateToken, updateUser, verifyAccount } from '../controllers/user-controller'
import { comparePassword } from '../controllers/crypt-controller'

// Middlewares
import { validationEmail, validationName, validationPassword, validationTokenNotification } from '../middlewares/validation-field'
import verifyImage from '../middlewares/verify-image'

// Interfaces
import IUser from '../interfaces/user-interface'


const app = express();

const storage = multer.diskStorage({
    destination: 'images/',
    filename(_, file, callback) {
        callback(null, `${file.originalname}-${new Date().getTime()}.${file.originalname.split('.').pop()}`)
    },
})

const mul = multer({ storage })

// POST Authentication
app.post('/register', mul.single('image'), verifyImage, validationName, validationTokenNotification, validationEmail, validationPassword, async (req, res) => {
    const user: false | IUser = await createUser(req.body.name, req.body['token-notification'], req.body.email, req.body.password, res.locals.image)

    if (user === false)
        return res.status(404).json({
            status: 'error',
            message: 'user already exist'
        })
    return res.status(201).json(user)
})

app.post('/login', validationTokenNotification, validationEmail, validationPassword, async (req, res) => {
    console.log(req.body.email)
    const user: false | IUser = await verifyAccount(req.body.email)

    if (user === false) return res.status(404).json({
        status: 'error',
        message: 'user not exists'
    })

    const isSamePassword = await comparePassword(user.password, req.body.password)

    if (isSamePassword) {
        console.log(req.body['token-notification'])
        await updateToken(user._id, req.body['token-notification'])
        return res.status(200).json({ status: 'success', message: 'user exists and was updated token', data: await getDataUser(user._id) })
    }

    res.status(401).json({ status: 'error', message: 'password is wrong' })

})

// /user/:id
app.route('/:id').get(async (req, res) => {
    const id = req.params.id

    if (id === null) return res.status(401).json({ status: 'error', message: '\'id\' is null' })

    const user = await getDataUser(id)

    if (user === false)
        return res.status(404).json({
            status: 'error',
            message: 'user not found'
        })
    return res.status(200).json(user)

}).delete(async (req, res) => {
    const id = req.params.id
    if (id === null) return res.status(401).json({ status: 'error', message: '\'id\' is null' })

    const user = await deleteUser(id)

    if (user === false)
        return res.status(400).json({
            status: 'error',
            message: 'user not found'
        })

    return res.status(200).json({ status: 'success', message: 'user deleted with success of database', user })

}).put(validationName, validationTokenNotification, async (req, res) => {
    const id: string = req.params.id
    const { name } = req.body

    if (id === null) return res.status(404).json({ status: 'error', message: '\'id\' is null' })

    const user: false | IUser = await updateUser(id, { name, 'token-notification': req.body['token-notification'] })

    if (user === false)
        return res.status(404).json({
            status: 'error',
            message: 'user not found'
        })
    return res.status(200).json({ status: 'success', message: 'user updated with success of database', user })
})

export default app