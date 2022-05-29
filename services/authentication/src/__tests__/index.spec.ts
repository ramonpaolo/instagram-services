import request from 'supertest';

import app from '../index'

describe('POST /user', () => {
    const route = '/user'

    jest.setTimeout(60000);

    afterAll(async () => {
        app.close()
    })

    it('response status has to be equal 200 where create user with success', async () => {
        const response = await request(app).post(route).send({
            name: 'asdadasd',
            'token-notification': 'qindfasfbsdifbsdfuhsvufhsvufvasfdbpiasvfivasdfvasfipd'
        })

        // console.log(response)

        expect(response.status).toBe(200)
    })

    it('response status has to be equal 404 where name user is invalid', async () => {
        const response = await request(app).post(route).send({
            name: 'asd',
            'token-notification': '92ncnsdfhbshfbsfasdfhubf453525325wdfsdfsdfgsdfgdfg'
        })

        expect(response.status).toBe(404)
    })

    it('response message has to be equal null where name user is null', async () => {
        const response = await request(app).post(route).send({
            name: '',
            'token-notification': '92ncnsdfhbshfbsfasdfhubf453525325wdfsdfsdfgsdfgdfg'
        })

        expect(response.status).toBe(404)
    })

    it('response status has to be equal 404 where token-notification is invalid', async () => {
        const response = await request(app).post(route).send({
            name: 'Jhon',
            'token-notification': '4321'
        })

        expect(response.status).toBe(404)
    })

    it('response message has to be equal null where token-notification is null', async () => {
        const response = await request(app).post(route).send({
            name: 'Jhon',
            'token-notification': ''
        })

        expect(response.status).toBe(404)
    })
})