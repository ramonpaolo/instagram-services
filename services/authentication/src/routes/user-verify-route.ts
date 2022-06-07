import express from 'express'

// Models
import VerifyEmail from '../models/verify-email-model'
import UserModel from '../models/user-model'

const app = express()

// Verify Email
app.get('/verify/:id', async (req, res) => {
    const { id } = req.params

    const verifiedEmail = await VerifyEmail.findOne({
        where: {
            id
        }
    })

    if (verifiedEmail === null) res.status(403).json({ status: 'error', message: 'verification ID not searched' })

    await VerifyEmail.destroy({
        where: {
            id
        }
    })

    await UserModel.findByIdAndUpdate(await verifiedEmail?.toJSON().idUser, { $set: { 'verified-email': true } })

    res.status(200).json({ status: 'success', message: 'email verified with success', verifiedEmail })

})

export default app;