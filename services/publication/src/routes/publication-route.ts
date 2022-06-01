import express from 'express'
import { getPublication, getPublicationByUser, getPublications } from '../controllers/publication-controller'

// Settings
// import RabbitMQ from '../settings/rabbitMQ'

// import { createPublication } from '../controllers/publication-controller'

const app = express()


app.route('/').get(async (_, res) => {
    const publications = await getPublications()
    if(publications === false) res.status(404).json({status: 'error', message: 'we can\'t search publications'})
    res.status(200).json({
        status: 'success',
        data: publications
    })
})

app.route('/:id').get(async (req, res) => {
    const id = req.params.id
    if(id === null) res.status(404).json({status: 'error', message: '\'id\' is null'})
    const publications = await getPublication(Number(id))
    if(publications === false) res.status(404).json({status: 'error', message: 'we can\'t search publications'})
    res.status(200).json({
        status: 'success',
        data: publications
    })
})

app.route('/user/:id').get(async (req, res) => {
    const id = req.params.id
    if(id === null) res.status(404).json({status: 'error', message: '\'id\' is null'})
    const publications = await getPublicationByUser(Number(id))
    if(publications === false) res.status(404).json({status: 'error', message: 'we can\'t search publications'})
    res.status(200).json({
        status: 'success',
        data: publications
    })
})

export default app;