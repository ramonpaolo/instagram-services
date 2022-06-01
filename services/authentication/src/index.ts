import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import spdy from 'spdy'
import helmet from 'helmet'

// Routes
import user from './routes/user-route'

// Settings
import connection from './settings/mongodb'
import RabbitMQ from './settings/rabbitMQ'

dotenv.config()

const app = express();

const rabbitMQ = new RabbitMQ();

(async () => {
    await connection()
    await rabbitMQ.connection()
    await rabbitMQ.consumer('user')
    await rabbitMQ.consumer('token')
})()

app.use(express.json())
app.use(helmet())
app.use(cors())

const PORT = process.env.PORT || 3000

app.get('/', async (_, res) => {
    res.status(200).json({
        status: 'working'
    })
})

app.use('/user', user)

const server = spdy.createServer({
    cert: fs.readFileSync(__dirname + '/../server.crt'),
    key: fs.readFileSync(__dirname + '/../server.key')
}, app)

server.listen(PORT)

export default server