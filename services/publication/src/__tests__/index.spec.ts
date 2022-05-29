import request from 'supertest';

import app from '../index'

describe('GET /', () => {
    it('response status has to be equal 200', async () => {
        const response = await request(app).get('/')

        expect(response.status).toBe(200)
    })
})

app.close()