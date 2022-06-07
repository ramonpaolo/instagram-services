import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import spdy from 'spdy'
import helmet from 'helmet'

// Routes
import user from './routes/user-route'
import follow from './routes/user-follow-route'
import verify from './routes/user-verify-route'
import search from './routes/user-search-route'

// Settings
import connection from './settings/mongodb'
import RabbitMQ from './settings/rabbitMQ'
import sequelize from './settings/sequelize'

// Models
import VerifyEmail from './models/verify-email-model'

dotenv.config()

const app = express();

const rabbitMQ = new RabbitMQ();

(async () => {
    await sequelize.sync();
    VerifyEmail
    await connection()
    await rabbitMQ.connection()
    await rabbitMQ.consumer('token')
})()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(helmet())
app.use(cors())

const PORT = process.env.PORT || 3000

app.get('/', async (_, res) => {
    res.status(200).json({
        status: 'working'
    })
})

app.use('/user', user, follow, verify, search)

const server = spdy.createServer({
    cert: fs.readFileSync(__dirname + '/../server.crt'),
    key: fs.readFileSync(__dirname + '/../server.key')
}, app)

if (process.env.NODE_ENV !== 'development')
    server.listen(PORT)

export default server