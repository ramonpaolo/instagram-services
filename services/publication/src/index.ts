import express from 'express'
import dotenv from 'dotenv'
import fs from 'fs'
import spdy from 'spdy'
import helmet from 'helmet'

// Settings
import connection from './settings/mongodb';
import RabbitMQ from './settings/rabbitMQ'

// Routes
import publication from './routes/publication-route'

dotenv.config()

const app = express();
const rabbit = new RabbitMQ();

const PORT = process.env.PORT || 3000;

(async () => {
    await connection()
    await rabbit.connection()
    await rabbit.consumer('publication')
})()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(helmet())

// Use Routes
app.use('/publication', publication)

const server = spdy.createServer({
    cert: fs.readFileSync(__dirname + '/../server.crt'),
    key: fs.readFileSync(__dirname + '/../server.key')
}, app)

server.listen(PORT)

export default server