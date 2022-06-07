import express from 'express'

// Controllers
import { addFollower, addFollowing, removeFollower, removeFollowing } from '../controllers/follow-controller';

const app = express()

app.route('/:id/follow').put(async (req, res) => {
    const id = req.params.id;

    const { _id } = req.body

    if (_id === null || id === null) res.status(404).json({ status: 'error', message: 'id is null' })

    const successFollower = await addFollower(id, _id)
    if (!successFollower) res.status(404).json({ status: 'error', message: 'can\'t follow this user' })
    const successFollowing = await addFollowing(id, _id)

    res.status(200).json({ status: successFollowing ? 'success' : 'error' })

}).delete(async (req, res) => {
    const id = req.params.id;

    const { _id } = req.body

    if (_id === null || id === null) res.status(404).json({ status: 'error', message: 'id is null' })

    const successFollower = await removeFollower(id, _id)
    if (!successFollower) res.status(404).json({ status: 'error', message: 'can\'t follow this user' })
    const successFollowing = await removeFollowing(id, _id)

    res.status(200).json({ status: successFollowing ? 'success' : 'error' })

})

export default app