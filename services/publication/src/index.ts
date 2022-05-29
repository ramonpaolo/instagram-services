import express from 'express'
import compression from 'compression'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import spdy from 'spdy'
import helmet from 'helmet'
import expressRateLimit from 'express-rate-limit'

// Settings
import RabbitMQ from './settings/rabbitMQ'

// Routes
import publication from './routes/publication-route'

dotenv.config()

const app = express();
const rabbit = new RabbitMQ();

const PORT = process.env.PORT || 3000;

(async () => {
    await rabbit.connection()
})()

app.use(expressRateLimit({
    windowMs: 60 * 1000,
    max: 5,
    legacyHeaders: true
}))
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(compression())

// Use Routes
app.use('/publication', publication)

app.get('/', (_, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Project is working : )'
    })
})

const server = spdy.createServer({
    cert: fs.readFileSync(__dirname + '/../server.crt'),
    key: fs.readFileSync(__dirname + '/../server.key')
}, app)

server.listen(PORT)

export default server