import express from 'express'
import { createUser, deleteUser, getDataUser, updateUser } from '../controllers/user-controller'
import { validationName, validationTokenNotification } from '../middlewares/validation-field'

const app = express()

app.route('/').post(validationName, validationTokenNotification, async (req, res) => {
    const user = await createUser(req.body.name, req.body['token-notification'])

    if (user !== false) return res.status(201).json(user)
    else return res.status(404).json({
        status: 'fail',
        message: 'can\'t craete user'
    })
})
app.route('/:id').get(async (req, res) => {
    const id = req.params.id

    if(id === null) return res.status(401).json({status: 'error', message: '\'id\' is null'})

    const user = await getDataUser(Number(id))

    if (user !== false) return res.status(200).json(user)
    else return res.status(404).json({
        status: 'error',
        message: 'user not found'
    })
}).delete(async (req, res) => {
    const id = req.params.id

    if(id === null) return res.status(401).json({status: 'error', message: '\'id\' is null'})

    const user = await deleteUser(Number(id))

    if (user !== false) return res.status(200).json({status: 'success', message: 'user deleted with success of database', user})
    else return res.status(404).json({
        status: 'error',
        message: 'user not found'
    })
}).put(async (req, res) => {
    const id = req.params.id
    const {name} = req.body

    if(id === null) return res.status(401).json({status: 'error', message: '\'id\' is null'})

    const user = await updateUser(Number(id), name)

    if (user !== false) return res.status(200).json({status: 'success', message: 'user deleted with success of database', user})
    else return res.status(404).json({
        status: 'error',
        message: 'user not found'
    })
})

export default app