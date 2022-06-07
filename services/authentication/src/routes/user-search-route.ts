import express from 'express'
import { searchUser } from '../controllers/user-search-controller'

const app = express()

app.route('/search/:name').get(async (req, res) => {
    const name = req.params.name
    console.log(name)

    if (name === null) return res.status(401).json({ status: 'error', message: '\'id\' is null' })

    const users = await searchUser(name);

    if (users === null)
        return res.status(404).json({
            status: 'success',
            message: 'user not found'
        })
    return res.status(200).json(users)

})

export default app